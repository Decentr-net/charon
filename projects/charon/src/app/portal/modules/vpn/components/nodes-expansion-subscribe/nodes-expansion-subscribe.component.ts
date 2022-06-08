import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ControlsOf, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { catchError, finalize } from 'rxjs/operators';
import { EMPTY, map, Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Validators } from '@angular/forms';

import { SentinelService } from '@core/services/sentinel';
import { SpinnerService } from '@core/services';
import { DEFAULT_DENOM, SentinelNodeStatusWithSubscriptions } from '@shared/models/sentinel';
import { coerceCoin, findCoinByDenom } from '@shared/utils/price';
import { NotificationService } from '@shared/services/notification';
import { PricePipe } from '@shared/pipes/price';

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
      map((selectedPrice) => selectedPrice / +this.node.price?.amount),
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

    const { deposit } = this.form.getRawValue();

    this.sentinelService.subscribeToNode(
      this.node.address,
      findCoinByDenom(coerceCoin(deposit + this.node.price?.denom), DEFAULT_DENOM),
    ).pipe(
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(() => {
      this.notificationService.success(
        this.translocoService.translate('vpn_page.nodes_expansion.subscribe.notifications.subscribed', null, 'vpn'),
      );

      // TODO: request new list of subscriptions
    });
  }

  displayWith = (value: number): string => {
    return this.pricePipe.transform(findCoinByDenom(coerceCoin(value + this.node.price?.denom || ''), DEFAULT_DENOM));
  };
}
