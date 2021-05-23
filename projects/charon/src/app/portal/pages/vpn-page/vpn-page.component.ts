import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ProxyService } from '@core/services';

@UntilDestroy()
@Component({
  selector: 'app-vpn-page',
  templateUrl: './vpn-page.component.html',
  styleUrls: ['./vpn-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VpnPageComponent implements OnInit {
  @HostBinding('class.is-vpn-active')
  public isActive: boolean = true;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private proxyService: ProxyService,
  ) {
  }

  public ngOnInit(): void {
    this.proxyService.isProxyEnabled().pipe(
      untilDestroyed(this),
    ).subscribe((isProxyEnabled) => {
      this.isActive = isProxyEnabled;
      this.changeDetectorRef.markForCheck();
    });
  }

  public toggleProxy(): Promise<void> {
    if (this.isActive) {
      return this.proxyService.clearProxy();
    }

    return this.proxyService.setProxy('146.59.178.159');
  }
}
