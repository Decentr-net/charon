import { Injectable } from '@angular/core';
import { combineLatest, firstValueFrom, merge, Observable, of } from 'rxjs';
import { filter, map, mapTo } from 'rxjs/operators';

import { ConfigService, NetworkId } from '@shared/services/configuration';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';

@Injectable()
export class NetworkService {
  constructor(
    private configService: ConfigService,
    private networkStorage: NetworkBrowserStorageService,
  ) {
  }

  public init(): Promise<void> {
    return firstValueFrom(merge(
      of(!navigator.onLine),
      this.configService.getMaintenanceStatus(),
      this.isAPIInstantiated(),
    ).pipe(
      filter(Boolean),
      mapTo(void 0),
    ));
  }

  public getActiveNetworkAPIInstant(): string {
    return this.networkStorage.getActiveAPIInstant();
  }

  public getActiveNetworkId(): Observable<NetworkId> {
    return this.networkStorage.getActiveId();
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
