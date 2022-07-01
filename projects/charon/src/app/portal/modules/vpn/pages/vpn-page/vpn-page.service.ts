import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  defer,
  EMPTY,
  map,
  mergeMap,
  Observable,
  of,
  ReplaySubject,
  retry,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { combineLatestWith, delay, filter, finalize, shareReplay, startWith, take } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import Long from 'long';
import {
  BroadcastClientError,
  BroadcastUnknownError,
  Coin,
  SentinelNode,
  SentinelSession,
  SentinelSubscription,
  TimeoutError,
} from 'decentr-js';

import { findCoinByDenom, priceFromString } from '@shared/utils/price';
import { NotificationService } from '@shared/services/notification';
import { svgDelete } from '@shared/svg-icons/delete';
import { ConfigService } from '@shared/services/configuration';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog';
import { WireguardService } from '@shared/services/wireguard';
import { ONE_SECOND } from '@shared/utils/date';
import { TranslatedError } from '@core/notifications';
import { DEFAULT_DENOM, SentinelNodeStatus, SentinelService, SpinnerService } from '@core/services';
import { AppRoute } from '../../../../../app-route';
import { PortalRoute } from '../../../../portal-route';
import { RECEIVER_WALLET_PARAM } from '../../../assets/pages';
import { SentinelExtendedSubscription, SentinelNodeExtendedDetails } from './vpn-page.definitions';
import { InfiniteLoadingService } from '@shared/utils/infinite-loading';

interface AxiosError<T> extends Error {
  response?: {
    data: T;
  };
}

interface AxiosErrorObject {
  error: {
    code: number;
    message: string;
  },
}

@UntilDestroy()
@Injectable()
export class VpnPageService extends InfiniteLoadingService<SentinelNodeExtendedDetails> {
  private loadingCount: number = 10;

  private allNodes$: ReplaySubject<SentinelNodeExtendedDetails[]> = new ReplaySubject(1);

  private filteredNodes$: Observable<SentinelNodeExtendedDetails[]>;

  public onlySubscribed$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public refreshSessions$: Subject<void> = new Subject();

  public refreshSubscriptions$: Subject<void> = new Subject();

  public refreshNodes$: Subject<void> = new Subject();

  private nodeStatusMap: Map<SentinelNodeExtendedDetails['address'], SentinelNodeStatus> = new Map();

  constructor(
    @Inject(TRANSLOCO_SCOPE) private translocoScope: string,
    private configService: ConfigService,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private router: Router,
    private svgIconRegistry: SvgIconRegistry,
    private sentinelService: SentinelService,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
    private wireguardService: WireguardService,
  ) {
    super();

    svgIconRegistry.register([
      svgDelete,
    ]);
  }

  public init(): void {
    this.refreshNodes$.pipe(
      startWith(void 0),
      tap(() => this.allNodes$.next(undefined)),
      tap(() => this.nodeStatusMap.clear()),
      switchMap(() => this.getNodes()),
      untilDestroyed(this),
    ).subscribe(this.allNodes$);

    this.filteredNodes$ = this.allNodes$.pipe(
      filter((nodes) => !!nodes),
      combineLatestWith(this.onlySubscribed$),
      map(([allNodes, onlySubscribed]) => allNodes.filter((node) => !onlySubscribed || node.subscriptions.length > 0)),
    );

    this.filteredNodes$.pipe(
      untilDestroyed(this),
    ).subscribe((nodes) => {
      const length = this.list.value.length;
      this.list.next(nodes.slice(0, length));
    });
  }

  public getVpnMaintenance(): Observable<boolean> {
    return this.configService.getVpnMaintenance();
  }

  public checkWireguardConnection(): Promise<boolean> {
    return this.wireguardService.status().then((response) => response.result);
  }

  public isWgInstalled(): Promise<boolean> {
    return this.wireguardService.isWgInstalled().then((response) => response.result);
  }

  public getBalance(): Observable<Coin> {
    return this.sentinelService.getBalance().pipe(
      map((balances) => {
        return findCoinByDenom(balances, DEFAULT_DENOM) || priceFromString('0' + DEFAULT_DENOM)[0];
      }),
    );
  }

  private getNodes(): Observable<SentinelNodeExtendedDetails[]> {
    const subscriptionSource$ = this.refreshSubscriptions$.pipe(
      startWith(void 0),
      switchMap(() => this.sentinelService.getSubscriptionsForAddress()),
    );

    const sessionsSource$ = this.refreshSessions$.pipe(
      startWith(void 0),
      switchMap(() => this.sentinelService.getSessionsForAddress()),
    );

    return this.sentinelService.getNodes(DEFAULT_DENOM).pipe(
      mergeMap((nodes) => {
        if (!nodes.length) {
          return of([]);
        }

        return subscriptionSource$.pipe(
          combineLatestWith(sessionsSource$),
          map(([subscriptions, sessions]) => nodes.map((node) => {
            const cachedStatus = this.nodeStatusMap.get(node.address);

            return {
              ...node,
              sessions: sessions.filter((session) => session.node === node.address),
              subscriptions: subscriptions
                .filter((subscription) => subscription.node === node.address)
                .map((subscription) => ({
                  ...subscription,
                  sessions: sessions.filter((session) => session.subscription.equals(subscription.id)),
                })),
              status$: cachedStatus ? of(cachedStatus) : this.sentinelService.getNodeStatus(node.remoteUrl, node.statusAt).pipe(
                tap((status) => this.nodeStatusMap.set(node.address, status)),
                shareReplay(1),
              ),
            };
          })),
        );
      }),
    );
  }

  public override getNextItems(): Observable<SentinelNodeExtendedDetails[]> {
    return this.filteredNodes$.pipe(
      filter((nodes) => !!nodes),
      take(1),
      map((allNodes) => {
        const length = this.list.value.length;

        const nodes = allNodes.slice(length, length + this.loadingCount);
        if (nodes.length < this.loadingCount) {
          this.canLoadMore.next(false);
        }

        return nodes;
      }),
    );
  }

  public subscribeToNode(node: SentinelNodeExtendedDetails, deposit: Coin): Observable<void> {
    this.spinnerService.showSpinner();

    return this.sentinelService.subscribeToNode(
      node.address,
      deposit,
    ).pipe(
      catchError((error) => {
        this.handleTransactionError(error);

        return EMPTY;
      }),
      delay(5000),
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
      tap(v => console.log('cancel sub', v, subscriptionId)),
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
      map((response) => {
        if (!response.result) {
          throw new TranslatedError(this.translate('vpn_page.nodes_expansion.connect.notifications.not_connected'));
        }
      }),
      delay(5000),
      // observable navigator.online
      mergeMap(() => this.sentinelService.endSession(sessionIds).pipe(
        // TODO: check
        retry({
          count: 3,
          delay: ONE_SECOND,
        }),
      )),
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
      mergeMap((session) => this.sentinelService.addSession(node.remoteUrl, session.id).pipe(
        map((params) => ({
          ...params,
          address: subscription.owner,
          nodeAddress: node.address,
          sessionId: session.id.toInt(),
        })),
      )),
      catchError((error) => {
        console.log('sessionSource$', error);

        const isPeerExistsError = error.response?.data?.error?.code === 6;
        const sessionNotFound = error.response?.status === 404;

        if (isPeerExistsError || sessionNotFound) {
          return throwError(error);
        }

        this.handleTransactionError(error);

        return EMPTY;
      }),
      retry(3),
      mergeMap((connectionParams) => this.wireguardService.connect(connectionParams)),
      map((response) => {
        if (!response.result) {
          throw new TranslatedError('Not connected. Try again!');
        }
      }),
      delay(5000),
      // take(1),
      catchError((error) => {
        this.handleTransactionError(error);
        return EMPTY;
      }),
      tap(() => {
        return this.notificationService.success(
          this.translate('vpn_page.nodes_expansion.connect.notifications.connected'),
        );
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

  private handleTransactionError(
    error: BroadcastClientError | BroadcastUnknownError | TimeoutError | AxiosError<AxiosErrorObject> | Error,
  ): void {
    if ((error as BroadcastClientError).broadcastErrorCode) {
      return this.notificationService.error(new TranslatedError((error as BroadcastClientError).message));
    }

    if ((error as BroadcastUnknownError).log) {
      return this.notificationService.error(new TranslatedError((error as BroadcastUnknownError).log));
    }

    if ((error as AxiosError<AxiosErrorObject>).response?.data?.error?.code) {
      return this.notificationService.error(
        new TranslatedError((error as AxiosError<AxiosErrorObject>)?.response?.data?.error?.message),
      );
    }

    if (!!(error as TimeoutError).txId) {
      return this.notificationService.warning(
        this.translate('vpn_page.nodes_expansion.connect.notifications.tx_broadcasted'),
        null,
        {
          timeOut: 60000,
        },
      );
    }

    this.notificationService.error(error);
  }
}
