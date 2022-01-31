import { Injectable, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';
import { PDV, PDVType } from 'decentr-js';

import { coerceTimestamp } from '@shared/utils/date';
import { InfiniteLoadingService } from '@shared/utils/infinite-loading';
import { uuid } from '@shared/utils/uuid';
import { PDVService } from '@core/services';
import { ACTIVITY_DATE_FORMAT, ActivityListItem } from './activity-page.definitions';

@Injectable()
export class ActivityPageService extends InfiniteLoadingService<ActivityListItem> implements OnDestroy {
  private readonly loadingCount: number = 20;

  constructor(
    private datePipe: DatePipe,
    private pdvService: PDVService,
  ) {
    super();
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  protected getNextItems(): Observable<ActivityListItem[]> {
    const lastItem = this.list.value[this.list.value.length - 1];

    return this.pdvService.getPDVList({
      from: lastItem?.timestamp,
      limit: this.loadingCount,
    }).pipe(
      tap((pdvList) => pdvList.length < this.loadingCount && this.canLoadMore.next(false)),
      map((pdvList) => pdvList.map((pdvListItem) => ({
        timestamp: coerceTimestamp(pdvListItem),
        pdvBlocks: this.pdvService.getPDVDetails(pdvListItem).pipe(
          pluck('pdv'),
          map((pdvs) => this.groupPDVs(pdvs).map((pdvGroup) => ({
            type: pdvGroup[0].type,
            title: this.getPDVBlockTitle(pdvGroup[0]),
            pdv: pdvGroup.map((pdv) => ({
              title: this.getPDVTitle(pdv),
              details: pdv,
            })),
          }))),
        ),
      }))),
    );
  }

  private groupPDVs(pdvs: PDV[]): PDV[][] {
    const pdvMap = new Map<string, PDV[]>();

    pdvs.forEach((pdv) => {
      const key = this.getPDVGroupKey(pdv);
      const group = pdvMap.get(key) || [];
      pdvMap.set(key, [...group, pdv]);
    });

    return [...pdvMap.values()];
  }

  private getPDVGroupKey(pdv: PDV): string {
    switch (pdv.type) {
      case PDVType.Cookie:
        return `${pdv.type}-${pdv.domain}`;
      case PDVType.SearchHistory:
        return `${pdv.type}-${pdv.engine}`;
      default:
        return uuid();
    }
  }

  private getPDVBlockTitle(pdv: PDV): string {
    switch (pdv.type) {
      case PDVType.AdvertiserId:
        return pdv.advertiser;
      case PDVType.Cookie:
        return pdv.domain;
      case PDVType.Location:
        return `${pdv.latitude}, ${pdv.longitude}`;
      case PDVType.Profile:
        return `${pdv.firstName} ${pdv.lastName}`;
      case PDVType.SearchHistory:
        return pdv.engine;
    }
  }

  private getPDVTitle(pdv: PDV): string {
    switch (pdv.type) {
      case PDVType.AdvertiserId:
        return pdv.advertiser;
      case PDVType.Cookie:
        return pdv.name;
      case PDVType.Location:
        return pdv.timestamp;
      case PDVType.Profile:
        return `${pdv.firstName} ${pdv.lastName}`;
      case PDVType.SearchHistory:
        return this.datePipe.transform(pdv.timestamp, ACTIVITY_DATE_FORMAT);
    }
  }
}
