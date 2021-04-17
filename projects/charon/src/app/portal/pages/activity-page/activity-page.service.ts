import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';

import { PDVService } from '@shared/services/pdv';
import { coerceTimestamp } from '@shared/utils/date';
import { InfiniteLoadingService } from '@shared/utils/infinite-loading';
import { ActivityListItem } from './activity-page.definitions';

@Injectable()
export class ActivityPageService extends InfiniteLoadingService<ActivityListItem> implements OnDestroy {
  private readonly loadingCount: number = 20;

  constructor(
    private pdvService: PDVService,
  ) {
    super();
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  protected getNextItems(): Observable<ActivityListItem[]> {
    return this.pdvService.getPDVList({
      from: this.list.value[this.list.value.length - 1]?.timestamp / 1000 || undefined,
      limit: this.loadingCount,
    }).pipe(
      tap(console.log),
      tap((pdvList) => pdvList.length < this.loadingCount && this.canLoadMore.next(false)),
      map((pdvList) => pdvList.map((pdvListItem) => ({
        timestamp: coerceTimestamp(pdvListItem),
        pdvList: this.pdvService.getPDVDetails(pdvListItem).pipe(
          pluck('pdv'),
        ),
      })))
    );
  }
}
