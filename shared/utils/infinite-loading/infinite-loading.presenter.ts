import { Observable } from 'rxjs';
import { InfiniteLoadingService } from './infinite-loading.service';

export class InfiniteLoadingPresenter<T> {
  public isLoading$: Observable<boolean>;
  public list$: Observable<T[]>;
  public canLoadMore$: Observable<boolean>;

  constructor(protected infiniteLoadingService: InfiniteLoadingService<T>) {
    this.list$ = infiniteLoadingService.list$;

    this.isLoading$ = infiniteLoadingService.isLoading$;

    this.canLoadMore$ = infiniteLoadingService.canLoadMore$;
  }

  public loadMore(): void {
    this.infiniteLoadingService.loadMoreItems();
  }
}
