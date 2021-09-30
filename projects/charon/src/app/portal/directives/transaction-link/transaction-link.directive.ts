import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { combineLatest, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Environment } from '@environments/environment.definitions';
import { NetworkSelectorService } from '@core/services';

@UntilDestroy()
@Directive({
  selector: 'a[appTransactionLink]'
})
export class TransactionLinkDirective implements OnInit {
  private transactionIdSource: ReplaySubject<string> = new ReplaySubject(1);

  @Input('appTransactionLink')
  public set transactionId(value: string) {
    this.transactionIdSource.next(value);
  }

  constructor(
    private elementRef: ElementRef,
    private environment: Environment,
    private networkSelectorService: NetworkSelectorService,
    private renderer: Renderer2,
  ) {
  }

  public ngOnInit(): void {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'target', '_blank');

    combineLatest([
      this.networkSelectorService.getActiveNetwork(),
      this.transactionIdSource,
    ]).pipe(
      map(([network, transactionId]) => `${this.environment.explorer}/transactions/${transactionId}?networkId=${network.id}`),
      untilDestroyed(this),
    ).subscribe((src) => {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'href', src);
    });
  }
}
