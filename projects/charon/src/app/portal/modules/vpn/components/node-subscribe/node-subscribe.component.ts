import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { ControlsOf, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { map, Observable, of } from 'rxjs';
import { Coin } from 'decentr-js';
import { catchError, debounceTime, switchMap, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { PricePipe } from '@shared/pipes/price';
import { priceFromString } from '@shared/utils/price';
import { SentinelService } from '@core/services';
import { ONE_SECOND } from '@shared/utils/date';
import { SentinelExtendedSubscription } from '../../pages/vpn-page/vpn-page.definitions';

interface SubscribeForm {
  deposit: number;
}

@UntilDestroy()
@Component({
  selector: 'app-node-subscribe',
  templateUrl: './node-subscribe.component.html',
  styleUrls: ['./node-subscribe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeSubscribeComponent implements OnInit {
  @Input() public maxDeposit: number;

  @Input() public price!: Coin;

  @Input() public nodeAddress: string;

  @Input() public subscriptions: SentinelExtendedSubscription[];

  @Output() public subscribe: EventEmitter<Coin> = new EventEmitter();

  public form!: FormGroup<ControlsOf<SubscribeForm>>;

  public depositCapacity$!: Observable<number>;

  public fee: number;

  public canSubscribe: boolean;

  public canSubscribeLoading: boolean;

  public insufficientFunds: boolean;

  public maxSubscriptionsAllowed: number = 3;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private sentinelService: SentinelService,
    private pricePipe: PricePipe,
  ) {
  }

  public get isMoreSubscriptionAllowed(): boolean {
    return this.subscriptions.length < this.maxSubscriptionsAllowed;
  }

  public ngOnInit(): void {
    this.form = this.createForm();

    this.depositCapacity$ = this.form.get('deposit').value$.pipe(
      map((selectedPrice) => selectedPrice / +this.price.amount),
    );

    this.form.value$.pipe(
      tap(() => {
        this.fee = 0;
        this.canSubscribe = false;
        this.canSubscribeLoading = true;
        this.insufficientFunds = false;
      }),
      debounceTime(ONE_SECOND * 2),
      switchMap((formValue) => {
        const deposit = formValue.deposit;

        return deposit
          ? this.sentinelService.getSubscribeToNodeFee(this.nodeAddress, this.buildCoin(deposit)).pipe(
            catchError(() => of(0)),
          )
          : of(0);
      }),
      untilDestroyed(this),
    ).subscribe((fee) => {
      const deposit = this.form.get('deposit').value;

      this.canSubscribeLoading = false;
      this.fee = fee;
      this.canSubscribe = this.maxDeposit - this.fee >= deposit;
      this.insufficientFunds = this.maxDeposit < deposit;

      this.changeDetectorRef.markForCheck();
    });
  }

  private buildCoin(deposit: number): Coin {
    return {
      denom: this.price.denom,
      amount: deposit.toString(),
    };
  }

  public createForm(): FormGroup<ControlsOf<SubscribeForm>> {
    return this.formBuilder.group({
      deposit: [
        0,
        [
          Validators.required,
        ],
      ],
    });
  }

  public subscribeToNode(): void {
    const { deposit } = this.form.getRawValue();

    this.subscribe.emit(this.buildCoin(deposit));
  }

  public displayWith = (value: number): string => {
    return this.pricePipe.transform(priceFromString(value + this.price.denom)[0]);
  };
}
