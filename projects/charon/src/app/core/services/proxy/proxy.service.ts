import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ExtensionProxySettings, getActiveProxySettings, setProxy } from '@shared/utils/browser';
import { ProxyServer } from './proxy.definitions';

@Injectable()
export class ProxyService {
  public clearProxy(): Promise<void> {
    return setProxy(undefined);
  }

  public getProxies(): Observable<ProxyServer[]> {
    return of([
      {
        host: '199.247.19.150:3131',
        region: 'Frankfurt',
      },
    ]);
  }

  public getActiveProxySettings(): Observable<ExtensionProxySettings> {
    return getActiveProxySettings();
  }

  public setProxy(host: string): Promise<void> {
    return setProxy(host);
  }
}
