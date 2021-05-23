import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { isProxyEnabled, setProxy } from '@shared/utils/browser';

@Injectable()
export class ProxyService {
  public clearProxy(): Promise<void> {
    return setProxy(undefined);
  }

  public isProxyEnabled(): Observable<boolean> {
    return isProxyEnabled();
  }

  public setProxy(host: string): Promise<void> {
    return setProxy(host);
  }
}
