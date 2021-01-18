import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PDVDetails, PDVListItem, Wallet } from 'decentr-js';

import { Environment } from '@environments/environment.definitions';
import {
  BalanceValueDynamic,
  PDVService as NativePDVService,
  PDVStatChartPoint,
  PDVUpdateNotifier,
} from '@shared/services/pdv';
import { whileDocumentVisible } from '@shared/utils/document';
import { StateChangesService } from '../state';
import { Network } from '@core/services';

@UntilDestroy()
@Injectable()
export class PDVService extends NativePDVService {
  private wallet: Wallet;
  private networkApi: Network['api'];

  constructor(
    private environment: Environment,
    private stateChangesService: StateChangesService,
  ) {
    super(environment.chainId);

    this.stateChangesService.getWalletAndNetworkApiChanges().pipe(
      untilDestroyed(this),
    ).subscribe(({ wallet, networkApi }) => {
      this.wallet = wallet;
      this.networkApi = networkApi;
    });
  }

  public getBalance(): Observable<string> {
    return whileDocumentVisible(
      combineLatest([
        this.stateChangesService.getWalletAndNetworkApiChanges(),
        PDVUpdateNotifier.listen().pipe(
          startWith(void 0),
        ),
      ]).pipe(
        switchMap(([{ wallet, networkApi }]) => {
          return super.getBalance(networkApi, wallet.address);
        }),
      ),
    );
  }

  public getPDVDetails(address: PDVListItem['address'],): Observable<PDVDetails> {
    return super.getPDVDetails(this.networkApi, address, this.wallet);
  }

  public getPDVStatChartPoints(): Observable<PDVStatChartPoint[]> {
    return this.stateChangesService.getWalletAndNetworkApiChanges().pipe(
      switchMap(({ wallet, networkApi }) => {
        return super.getPDVStatChartPoints(networkApi, wallet.address);
      }),
    );
  }

  public getBalanceWithMargin(): Observable<BalanceValueDynamic> {
    return whileDocumentVisible(
      combineLatest([
        this.stateChangesService.getWalletAndNetworkApiChanges(),
        PDVUpdateNotifier.listen().pipe(
          startWith(void 0),
        ),
      ]).pipe(
        switchMap(([{ wallet, networkApi }]) => {
          return super.getBalanceWithMargin(networkApi, wallet.address);
        })
      ),
    );
  }
}
