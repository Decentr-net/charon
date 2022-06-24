import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  defer,
  EMPTY,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  retry,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { combineLatestWith, filter, finalize, startWith, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import Long from 'long';
import {
  BroadcastClientError,
  Coin,
  SentinelNode,
  SentinelSession,
  SentinelSubscription,
  TimeoutError,
} from 'decentr-js';

import { findCoinByDenom, priceFromString } from '@shared/utils/price';
import { NotificationService } from '@shared/services/notification';
import { svgDelete } from '@shared/svg-icons/delete';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog';
import { WireguardService } from '@shared/services/wireguard';
import { TranslatedError } from '@core/notifications';
import { DEFAULT_DENOM, SentinelNodeStatusWithSubscriptions, SentinelService, SpinnerService } from '@core/services';
import { AppRoute } from '../../../../../app-route';
import { PortalRoute } from '../../../../portal-route';
import { RECEIVER_WALLET_PARAM } from '../../../assets/pages';
import { SentinelExtendedSubscription, SentinelNodeExtendedDetails } from './vpn-page.definitions';

@UntilDestroy()
@Injectable()
export class VpnPageService {
  constructor(
    @Inject(TRANSLOCO_SCOPE) private translocoScope: string,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private router: Router,
    private sentinelService: SentinelService,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
    private wireguardService: WireguardService,
  ) {
  }

  public checkWireguardConnection(): Promise<boolean> {
    return this.wireguardService.status();
  }

  public getBalance(): Observable<Coin> {
    return this.sentinelService.getBalance().pipe(
      map((balances) => {
        return findCoinByDenom(balances, DEFAULT_DENOM) || priceFromString('0' + DEFAULT_DENOM)[0];
      }),
    );
  }

  public getNodes(updateSources?: {
    subscriptions?: Observable<void>;
    sessions?: Observable<void>,
  }): Observable<SentinelNodeExtendedDetails[]> {
    const subscriptionSource$ = (updateSources?.subscriptions || EMPTY).pipe(
      startWith(void 0),
      switchMap(() => this.sentinelService.getSubscriptionsForAddress()),
    );

    const sessionsSource$ = (updateSources?.sessions || EMPTY).pipe(
      startWith(void 0),
      switchMap(() => this.sentinelService.getSessionsForAddress()),
    );

    return this.sentinelService.getNodes(DEFAULT_DENOM).pipe(
      mergeMap((nodes) => {
        if (!nodes.length) {
          return of([]);
        }

        return forkJoin(nodes.map((node) => this.sentinelService.getNodeStatus(node.remoteUrl))).pipe(
          map((nodeStatuses) => nodeStatuses.filter((nodeStatus) => !!nodeStatus)),
          combineLatestWith(subscriptionSource$, sessionsSource$),
          map(([nodeStatuses, subscriptions, sessions]) => nodeStatuses.map((nodeStatus) => ({
            ...nodeStatus,
            sessions: sessions.filter((session) => session.node === nodeStatus.address),
            subscriptions: subscriptions
              .filter((subscription) => subscription.node === nodeStatus.address)
              .map((subscription) => ({
                ...subscription,
                sessions: sessions.filter((session) => session.subscription.equals(subscription.id)),
              })),
          }))),
        );
      }),
    );
  }

  public subscribeToNode(node: SentinelNodeStatusWithSubscriptions, deposit: Coin): Observable<void> {
    this.spinnerService.showSpinner();

    return this.sentinelService.subscribeToNode(
      node.address,
      deposit,
    ).pipe(
      catchError((error) => {
        this.handleTransactionError(error);

        return EMPTY;
      }),
      tap(() => {
        this.notificationService.success(
          this.translate('vpn_page.nodes_expansion.subscribe.notifications.subscribed'),
        );
      }),
      finalize(() => this.spinnerService.hideSpinner()),
    );
  }

  public cancelSubscription(subscriptionId: Long): Observable<void> {
    return this.askCancelSubscriptionConfirmation().pipe(
      filter((confirmed: boolean) => confirmed),
      tap(() => this.spinnerService.showSpinner()),
      mergeMap(() => this.sentinelService.cancelSubscription(subscriptionId)),
      catchError((error) => {
        this.handleTransactionError(error);

        return EMPTY;
      }),
      tap(() => {
        this.notificationService.success(
          this.translate('vpn_page.nodes_expansion.connect.notifications.subscription_cancelled'),
        );
      }),
      finalize(() => this.spinnerService.hideSpinner()),
    );
  }

  public disconnect(sessionIds: Long[]): Observable<void> {
    this.spinnerService.showSpinner();

    return defer(() => this.wireguardService.disconnect()).pipe(
      mergeMap(() => this.sentinelService.endSession(sessionIds)),
      catchError((error) => {
        this.handleTransactionError(error);

        return EMPTY;
      }),
      tap(() => {
        this.notificationService.success(
          this.translate('vpn_page.nodes_expansion.connect.notifications.disconnected'),
        );
      }),
      finalize(() => this.spinnerService.hideSpinner()),
    );
  }

  public connect(node: SentinelNodeExtendedDetails, subscription: SentinelExtendedSubscription): Observable<void> {
    this.spinnerService.showSpinner();

    let activeSession = subscription.sessions[0];

    const sessionSource$ = new Observable<SentinelSession>((subscriber) => {
      if (activeSession) {
        subscriber.next(activeSession);
        activeSession = undefined;
        return;
      }

      this.startSession(node.address, subscription.id).pipe(untilDestroyed(this)).subscribe(subscriber);
    });

    return sessionSource$.pipe(
      mergeMap((session) => this.sentinelService.addSession(node.remoteUrl, session.id)),
      catchError((error) => {
        const isPeerExistsError = error.response?.data?.error?.code === 6;

        if (isPeerExistsError) {
          return throwError(error);
        }

        this.handleTransactionError(error);

        return EMPTY;
      }),
      retry(3),
      tap((params) => console.log('params', params)),
      mergeMap((connectionParams) => this.wireguardService.connect(connectionParams)),
      take(1),
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
      finalize(() => this.spinnerService.hideSpinner()),
    );
  }

  public topUpBalance(): void {
    this.router.navigate(['/', AppRoute.Portal, PortalRoute.Assets, PortalRoute.Transfer], {
      queryParams: {
        [RECEIVER_WALLET_PARAM]: this.sentinelService.sentinelWalletAddress,
      },
    });
  }

  private startSession(
    nodeAddress: SentinelNode['address'],
    subscriptionId: SentinelSubscription['id'],
  ): Observable<SentinelSession> {
    return this.sentinelService.getSessionsForAddress().pipe(
      map((sessions) => sessions.map(({ id }) => id)),
      switchMap((sessionsIds) => this.sentinelService.startSession(nodeAddress, subscriptionId, sessionsIds)),
      switchMap(() => this.sentinelService.getSessionsForAddress()),
      map((sessions) => sessions.find((session) => session.subscription.equals(subscriptionId))),
    );
  }

  private translate(key: string): string {
    return this.translocoService.translate(
      key,
      null,
      this.translocoScope,
    );
  }

  private askCancelSubscriptionConfirmation(): Observable<boolean> {
    const translations = this.translocoService.translateObject(
      'vpn_page.nodes_expansion.connect.cancel_subscription_confirmation',
      {},
      this.translocoScope,
    );

    const config = {
      ...translations,
      cancel: {
        label: translations.close,
      },
      confirm: {
        icon: svgDelete.name,
        label: translations.cancel_subscription,
      },
      alert: true,
    };

    return this.confirmationDialogService.open(config).afterClosed();
  }

  private handleTransactionError(error: BroadcastClientError | TimeoutError | Error): void {
    if ((error as BroadcastClientError).broadcastErrorCode) {
      return this.notificationService.error(new TranslatedError(error.message));
    }

    if (!!(error as TimeoutError).txId) {
      return this.notificationService.warning(
        this.translate('vpn_page.nodes_expansion.connect.notifications.tx_broadcasted'),
        null,
        {
          timeOut: 0,
        },
      );
    }

    this.notificationService.error(error);
  }
}
