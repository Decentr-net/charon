import { Injectable } from '@angular/core';
import { filter, first, map, mapTo } from 'rxjs/operators';
import { combineLatest, merge, Observable, of } from 'rxjs';

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
      of(!navigator.onLine),
      this.configService.getMaintenanceStatus(),
      this.isAPIInstantiated(),
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

  private isAPIInstantiated(): Observable<boolean> {
    return combineLatest([
      this.configService.getRestNodes(),
      this.networkStorage.getActiveAPI(),
    ]).pipe(
      map(([restNodes, activeNode]) => restNodes.includes(activeNode)),
    );
  }
}
