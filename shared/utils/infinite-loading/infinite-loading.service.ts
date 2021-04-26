import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

export abstract class InfiniteLoadingService<T> {
  protected readonly canLoadMore: BehaviorSubject<boolean> = new BehaviorSubject(true);

  protected readonly list: BehaviorSubject<T[]> = new BehaviorSubject([]);

  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private readonly loadMore: Subject<void> = new Subject();

  private readonly stopLoading: Subject<void> = new Subject<void>();

  private readonly dispose$: Subject<void> = new Subject();

  protected constructor() {
    this.loadMore.pipe(
      tap(() => this.isLoading.next(true)),
      switchMap(() => this.getNextItems().pipe(
        takeUntil(this.stopLoading),
        finalize(() => this.isLoading.next(false)),
      )),
      takeUntil(this.dispose$),
    ).subscribe((items) => this.pushItems(items));
  }

  public dispose(): void {
    this.dispose$.next();
    this.dispose$.complete();
  }

  public get list$(): Observable<T[]> {
    return this.list.asObservable();
  }

  public get canLoadMore$(): Observable<boolean> {
    return this.canLoadMore.asObservable();
  }

  public get isLoading$(): Observable<boolean> {
    return this.isLoading;
  }

  public loadMoreItems(): void {
    this.loadMore.next();
  }

  protected abstract getNextItems(): Observable<T[]>;

  protected reload(): void {
    this.clear();
    this.loadMoreItems();
  }

  protected pushItems(items: T[]): void {
    this.list.next([
      ...this.list.value,
      ...items,
    ]);
  }

  protected clear(): void {
    this.stopLoading.next();
    this.list.next([]);
    this.canLoadMore.next(true);
  }
}
