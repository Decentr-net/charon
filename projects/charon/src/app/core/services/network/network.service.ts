import { Injectable } from '@angular/core';
import { filter, first, mapTo } from 'rxjs/operators';
import { merge, Observable } from 'rxjs';

import { ConfigService } from '@shared/services/configuration';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';

@Injectable()
export class NetworkService {
  constructor(
    private configService: ConfigService,
    private networkStorage: NetworkBrowserStorageService,
  ) {
  }

  public init(): Promise<void> {
    return merge(
      this.configService.getMaintenanceStatus(),
      this.networkStorage.getActiveAPI(),
    ).pipe(
      filter(Boolean),
      mapTo(void 0),
      first(),
    ).toPromise();
  }

  public getActiveNetworkAPI(): Observable<string> {
    return this.networkStorage.getActiveAPI();
  }

  public getActiveNetworkAPIInstant(): string {
    return this.networkStorage.getActiveAPIInstant();
  }
}
