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
        host: '168.138.211.5:8080',
        region: 'Japan',
      },
      {
        host: '79.111.13.155:50625',
        region: 'Russian Federation',
      },
      {
        host: '81.90.224.248:3128',
        region: 'Ukraine',
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
