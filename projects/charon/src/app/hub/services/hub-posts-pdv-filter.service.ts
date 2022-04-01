import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { PostsListFilterOptions } from 'decentr-js';

export enum PostPdvFilter {
  POSITIVE,
  POSITIVE_NEUTRAL,
  ALL,
}

@Injectable({
  providedIn: 'root',
})
export class HubPostsPdvFilterService {
  public options: Record<PostPdvFilter, PostsListFilterOptions> = {
    [PostPdvFilter.POSITIVE]: {
      excludeNegative: true,
      excludeNeutral: true,
    },
    [PostPdvFilter.POSITIVE_NEUTRAL]: {
      excludeNegative: true,
    },
    [PostPdvFilter.ALL]: {},
  };

  private readonly defaultFilter = PostPdvFilter.POSITIVE_NEUTRAL;

  private postsFilter$: BehaviorSubject<PostPdvFilter> = new BehaviorSubject(this.defaultFilter);

  public getFilterValue(): Observable<PostsListFilterOptions> {
    return this.getFilterId().pipe(
      map((id) => this.options[id]),
    );
  }

  public getFilterId(): Observable<PostPdvFilter> {
    return this.postsFilter$.pipe(
      distinctUntilChanged(),
    );
  }

  public resetFilter(): void {
    this.postsFilter$.next(this.defaultFilter);
  }

  public setFilterId(value: PostPdvFilter): void {
    this.postsFilter$.next(value);
  }
}
