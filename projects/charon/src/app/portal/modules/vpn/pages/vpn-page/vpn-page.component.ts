import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mapTo, share, switchMap } from 'rxjs/operators';
import { FormControl } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { VPNServer } from '@shared/services/configuration';
import { isOpenedInTab } from '@shared/utils/browser';
import { ProxyService } from '@core/services';
import { flagsIcons } from '@shared/svg-icons/flags';

@UntilDestroy()
@Component({
  selector: 'app-vpn-page',
  templateUrl: './vpn-page.component.html',
  styleUrls: ['./vpn-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VpnPageComponent implements OnInit {
  @HostBinding('class.mod-popup-view')
  public isOpenedInPopup: boolean = !isOpenedInTab();

  @HostBinding('class.is-vpn-active') get isActive(): boolean {
    return !this.isLoading && !!this.activeServer;
  }

  public isLoading: boolean;

  public activeServer: VPNServer;

  public isFirefoxHintVisible: boolean;
  public isUnknownBrowser: boolean;

  public servers$: Observable<VPNServer[]>;

  public serverFormControl: FormControl<VPNServer> = new FormControl();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private proxyService: ProxyService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      ...flagsIcons,
    ]);
  }

  public ngOnInit(): void {
    this.servers$ = this.proxyService.getProxies().pipe(
      catchError(() => of([])),
      share(),
    );

    this.proxyService.getActiveProxySettings().pipe(
      mapTo(false),
      catchError(() => of(true)),
      untilDestroyed(this),
    ).subscribe((isUnknownBrowser) => {
      this.isUnknownBrowser = isUnknownBrowser;
      this.changeDetectorRef.markForCheck();
    });

    this.proxyService.isSelfProxyEnabled().pipe(
      switchMap((isProxyEnabled) => isProxyEnabled
        ? combineLatest([
          this.proxyService.getActiveProxySettings().pipe(
            catchError(() => EMPTY),
          ),
          this.servers$,
        ]).pipe(
          map(([settings, servers]) => {
            return servers.find((server) => server.address === settings.host)
              || { address: settings.host, port: settings.port };
          }),
        )
        : of(void 0)
      ),
      untilDestroyed(this),
    ).subscribe((activeServer: VPNServer) => {
      this.activeServer = activeServer;

      if (activeServer?.title) {
        this.serverFormControl.setValue(activeServer);
      }

      this.changeDetectorRef.detectChanges();
    });

    this.servers$.pipe(
      untilDestroyed(this),
    ).subscribe((servers) => {
      this.serverFormControl.setValue(servers[0]);
    });
  }

  public toggleProxy(): Promise<void> {
    if (this.isActive) {
      return this.proxyService.clearProxy();
    }

    const { address, port } = this.serverFormControl.value;

    this.isLoading = true;

    return this.proxyService.setProxy(address, port).then(() => {
      this.isFirefoxHintVisible = false;
    }, (reject) => {
      if (reject.message === 'proxy.settings requires private browsing permission.') {
        this.isFirefoxHintVisible = true;
      }
    }).finally(() => {
      this.isLoading = false;
      this.changeDetectorRef.markForCheck();
    });
  }
}
