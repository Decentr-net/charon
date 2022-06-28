import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgLogoIcon } from '@shared/svg-icons/logo-icon';
import { isOpenedInPopup, isOpenedInTab } from '@shared/utils/browser';
import { WireguardService } from '@shared/services/wireguard';
import { APP_VERSION } from '@shared/utils/version';
import { HelpService } from '@core/services';
import { APP_TITLE } from './app.definitions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @HostBinding('attr.version') public appVersion: string = APP_VERSION;

  @HostBinding('class.mod-popup-view') public isOpenedInPopup = isOpenedInPopup();

  @HostBinding('class.mod-tab-view') public isOpenedInTab = isOpenedInTab();

  public isInitLoading = true;

  public isWireguardConnected$: Observable<boolean>;

  constructor(
    private wireguardService: WireguardService,
    helpService: HelpService,
    svgIconRegistry: SvgIconRegistry,
    titleService: Title,
  ) {
    helpService.initialize();

    svgIconRegistry.register([
      svgLogoIcon,
    ]);

    titleService.setTitle(APP_TITLE);
  }

  public ngOnInit(): void {
    this.isWireguardConnected$ = from(this.wireguardService.status()).pipe(
      map((response) => response.result),
    );
  }

  public onWireguardDisconnect(): void {
    console.log('app.component onWireguardDisconnect');
    this.wireguardService.disconnect().then((response) => {
      if (response.result) {
        return window.location.reload;
      }

      return void 0;
    });
  }
}
