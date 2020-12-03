import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Post } from 'decentr-js';

export abstract class HubPostsService {
  private posts: BehaviorSubject<Post[]> = new BehaviorSubject([]);
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private loadMore: Subject<number> = new Subject();
  private canLoadMore: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private readonly dispose$: Subject<void> = new Subject();

  protected constructor() {
    this.loadMore.pipe(
      tap(() => this.isLoading.next(true)),
      switchMap((count) => this.loadPosts(this.getLastPost(), count).pipe(
        tap((posts) => (posts.length < count) && this.canLoadMore.next(false)),
        finalize(() => this.isLoading.next(false)),
      )),
      takeUntil(this.dispose$),
    ).subscribe((posts) => {
      this.pushPosts(posts);
    });
  }

  public get posts$(): Observable<Post[]> {
    return this.posts.asObservable();
  }

  public get isLoading$(): Observable<boolean> {
    return this.isLoading.pipe(
      distinctUntilChanged(),
    );
  }

  public get canLoadMore$(): Observable<boolean> {
    return this.canLoadMore.pipe(
      distinctUntilChanged(),
    );
  }

  public loadMorePosts(count: number): void {
    this.loadMore.next(count);
  }

  public dispose(): void {
    this.dispose$.next();
    this.dispose$.complete();
  }

  protected abstract loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]>;

  private getLastPost(): Post | undefined {
    return this.posts.value[this.posts.value.length - 1];
  }

  private pushPosts(posts: Post[]): void {
    const currentPosts = this.posts.value;
    this.posts.next([...currentPosts, ...posts]);
  }
}
