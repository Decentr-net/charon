import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, finalize, map, pluck, startWith, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CurrencySymbolService } from '@shared/components/currency-symbol';
import { DistributionService, SpinnerService } from '@core/services';
import { MicroValuePipe } from '@shared/pipes/micro-value';
import { NotificationService } from '@shared/services/notification';
import { ValidatorOperatorDefinitionShort } from '../../models';
import { WithdrawValidatorPageService } from './widthraw-validator-page.service';

const VALIDATOR_ADDRESS_PARAM = 'validatorAddressParam';

@UntilDestroy()
@Component({
  selector: 'app-withdraw-validator-page',
  templateUrl: './withdraw-validator-page.component.html',
  styleUrls: ['./withdraw-validator-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    WithdrawValidatorPageService,
  ],
})
export class WithdrawValidatorPageComponent implements OnInit {
  public fee$: Observable<number>;

  public selectedItems$: BehaviorSubject<ValidatorOperatorDefinitionShort[]> = new BehaviorSubject([]);

  public selectedItemsRewards$: Observable<number>;

  public validators$: Observable<ValidatorOperatorDefinitionShort[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private currencySymbolService: CurrencySymbolService,
    private distributionService: DistributionService,
    private microValuePipe: MicroValuePipe,
    private notificationService: NotificationService,
    private router: Router,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
    private withdrawValidatorPageService: WithdrawValidatorPageService,
  ) {
  }

  public getSelectedItemsRewards(): Observable<number> {
    return this.selectedItems$.pipe(
      map((items) => items.reduce((sum, item) => sum + item.reward, 0))
    );
  }

  public ngOnInit(): void {
    this.selectedItemsRewards$ = this.getSelectedItemsRewards();

    this.validators$ = this.activatedRoute.params.pipe(
      pluck(VALIDATOR_ADDRESS_PARAM),
      switchMap((validatorAddress) => this.withdrawValidatorPageService.getValidator(validatorAddress)),
    );

    this.fee$ = this.getFee();

    combineLatest([
      this.activatedRoute.params.pipe(
        pluck(VALIDATOR_ADDRESS_PARAM),
      ),
      this.validators$,
    ]).pipe(
      map(([initialSelectedValidatorAddress, validators]) => {
        return validators.find(({ address }) => address === initialSelectedValidatorAddress);
      }),
      filter((selectedValidator) => !!selectedValidator),
      untilDestroyed(this)
    ).subscribe((selectedValidator) => {
      this.chooseValidator(selectedValidator);
    });
  }

  public chooseValidator(validator: ValidatorOperatorDefinitionShort): void {
    this.selectedItems$.next([validator]);
  }

  public getFee(): Observable<number> {
    return this.selectedItems$.pipe(
      filter((items) => items.length > 0),
      switchMap((items) => this.distributionService.calculateWithdrawValidatorRewardsFee(items[0].address)),
      startWith(0),
    );
  }

  public onSubmit(): void {
    this.spinnerService.showSpinner();

    this.distributionService.withdrawValidatorRewards(this.selectedItems$.value[0].address).pipe(
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
      switchMap(() => combineLatest([
        this.currencySymbolService.getSymbol(),
        this.getSelectedItemsRewards(),
      ])),
      take(1),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(([currencySymbol, amount]) => {
      this.notificationService.success(
        this.translocoService.translate(
          'staking.withdraw_validator_page.notification.success',
          {
            amount: this.microValuePipe.transform(amount),
            currencySymbol,
          },
        ),
      );

      this.router.navigate(['../'], {
        relativeTo: this.activatedRoute,
      });
    });
  }
}
