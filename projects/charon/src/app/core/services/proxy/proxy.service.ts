import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Config, ConfigService } from '@shared/services/configuration';
import {
  clearProxy,
  ExtensionProxySettings,
  getActiveProxySettings,
  isSelfProxyEnabled,
  setProxy,
} from '@shared/utils/browser';

@Injectable()
export class ProxyService {
  constructor(
    private configService: ConfigService,
  ) {
  }

  public clearProxy(): Promise<void> {
    return clearProxy();
  }

  public getProxies(): Observable<Config['vpn']['servers']> {
    this.configService.forceUpdate();

    return this.configService.getVPNSettings().pipe(
      map(({ enabled, servers }) => enabled ? servers : []),
    );
  }

  public getActiveProxySettings(): Observable<ExtensionProxySettings> {
    return getActiveProxySettings();
  }

  public setProxy(host: string, port: number): Promise<void> {
    return setProxy(host, port);
  }

  public isSelfProxyEnabled(): Observable<boolean> {
    return isSelfProxyEnabled();
  }
}
