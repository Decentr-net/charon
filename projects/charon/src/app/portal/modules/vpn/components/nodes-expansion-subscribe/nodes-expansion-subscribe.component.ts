import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ControlsOf, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { catchError, finalize } from 'rxjs/operators';
import { EMPTY, map, Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Validators } from '@angular/forms';

import { DEFAULT_DENOM, SentinelNodeStatusWithSubscriptions, SentinelService } from '@core/services/sentinel';
import { filterCoinsByDenom, priceFromString } from '@shared/utils/price';
import { NotificationService } from '@shared/services/notification';
import { PricePipe } from '@shared/pipes/price';
import { SpinnerService } from '@core/services';

interface Form {
  deposit: number;
}

@UntilDestroy()
@Component({
  selector: 'app-nodes-expansion-subscribe',
  templateUrl: './nodes-expansion-subscribe.component.html',
  styleUrls: ['./nodes-expansion-subscribe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodesExpansionSubscribeComponent implements OnInit {
  @Input() public node!: SentinelNodeStatusWithSubscriptions;

  public form!: FormGroup<ControlsOf<Form>>;

  public depositCapacity$!: Observable<number>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private pricePipe: PricePipe,
    private sentinelService: SentinelService,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
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

  public subscribeToNode(): void {
    this.spinnerService.showSpinner();

    const { deposit } = this.form!.getRawValue();

    this.sentinelService.subscribeToNode(
      this.node.address,
      filterCoinsByDenom(priceFromString(deposit + this.node.price.denom), DEFAULT_DENOM),
    ).pipe(
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe((response) => {
      this.notificationService.success(
        this.translocoService.translate('vpn_page.nodes_expansion.subscribe.notifications.subscribed', null, 'vpn'),
      );

      console.log('subscribe to node', response);
    });
  }

  displayWith = (value: number): string => {
    return this.pricePipe.transform(filterCoinsByDenom(priceFromString(value + this.node.price.denom), DEFAULT_DENOM));
  };
}
