import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Config, ConfigService } from '@shared/services/configuration';
import { ExtensionProxySettings, getActiveProxySettings, setProxy } from '@shared/utils/browser';

@Injectable()
export class ProxyService {
  constructor(
    private configService: ConfigService,
  ) {
  }

  public clearProxy(): Promise<void> {
    return setProxy(undefined);
  }

  public getProxies(): Observable<Config['vpn']['servers']> {
    return this.configService.getVPNSettings().pipe(
      map(({ enabled, servers }) => enabled ? servers : []),
    );
  }

  public getActiveProxySettings(): Observable<ExtensionProxySettings> {
    return getActiveProxySettings();
  }

  public setProxy(host: string, port?: number): Promise<void> {
    return setProxy({ host, port });
  }
}
