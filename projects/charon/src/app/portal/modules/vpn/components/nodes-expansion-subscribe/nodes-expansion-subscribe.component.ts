import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ControlsOf, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { map, Observable } from 'rxjs';
import { Validators } from '@angular/forms';

import { SentinelNodeStatus } from '@shared/services/sentinel';
import { PricePipe } from '@shared/pipes/price/price.pipe';
import { priceFromString } from '@shared/utils/price';

interface Form {
  deposit: number;
}

@Component({
  selector: 'app-nodes-expansion-subscribe',
  templateUrl: './nodes-expansion-subscribe.component.html',
  styleUrls: ['./nodes-expansion-subscribe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodesExpansionSubscribeComponent {
  @Input() public node!: SentinelNodeStatus;

  public form!: FormGroup<ControlsOf<Form>>;

  public depositCapacity$!: Observable<number>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private pricePipe: PricePipe,
  ) {
  }

  public ngOnInit(): void {
    this.form = this.createForm();

    this.depositCapacity$ = this.form.get('deposit').value$.pipe(
      map((selectedPrice) => selectedPrice / +this.node.price.amount),
    );
  }

  public createForm(): FormGroup<ControlsOf<Form>> {
    return this.formBuilder.group({
      deposit: [
        0,
        [
          Validators.required,
        ],
      ],
    });
  }

  public onSubmit(): void {
    const { deposit } = this.form!.getRawValue();

    console.log('submit', deposit);
  }

  displayWith = (value: number): string => {
    return this.pricePipe.transform(priceFromString(value + this.node.price.denom));
  }
}
