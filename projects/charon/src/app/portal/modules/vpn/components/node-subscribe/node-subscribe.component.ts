import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Validators } from '@angular/forms';
import { ControlsOf, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { map, Observable } from 'rxjs';
import { Coin } from 'decentr-js';

import { PricePipe } from '@shared/pipes/price';
import { priceFromString } from '@shared/utils/price';

interface SubscribeForm {
  deposit: number;
}

@Component({
  selector: 'app-node-subscribe',
  templateUrl: './node-subscribe.component.html',
  styleUrls: ['./node-subscribe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeSubscribeComponent implements OnInit {
  @Input() public maxDeposit: number;

  @Input() public price!: Coin;

  @Output() public subscribe: EventEmitter<Coin> = new EventEmitter();

  public form!: FormGroup<ControlsOf<SubscribeForm>>;

  public depositCapacity$!: Observable<number>;

  constructor(
    private formBuilder: FormBuilder,
    private pricePipe: PricePipe,
  ) {
  }

  public ngOnInit(): void {
    this.form = this.createForm();

    this.depositCapacity$ = this.form.get('deposit').value$.pipe(
      map((selectedPrice) => selectedPrice / +this.price.amount),
    );
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

    this.subscribe.emit({ denom: this.price.denom, amount: deposit.toString() });
  }

  public displayWith = (value: number): string => {
    return this.pricePipe.transform(priceFromString(value + this.price.denom)[0]);
  };

}
