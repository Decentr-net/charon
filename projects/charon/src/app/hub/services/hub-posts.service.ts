import { Injector, TrackByFunction } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';

import { NotificationService } from '@shared/services/notification';
import { PostsListItem, PostsService, SpinnerService } from '@core/services';
import { HubLikesService } from './hub-likes.service';

export abstract class HubPostsService<T extends PostsListItem = PostsListItem> {
  private static deleteNotifier$: Subject<PostsListItem['uuid']> = new Subject();

  protected readonly likesService: HubLikesService;
  protected readonly notificationService: NotificationService;
  protected readonly postsService: PostsService;
  protected readonly spinnerService: SpinnerService;
  protected readonly translocoService: TranslocoService;

  protected loadingMoreCount: number = 4;
  protected loadingInitialCount: number = 4;

  private posts: BehaviorSubject<T[]> = new BehaviorSubject([]);
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private loadMore: Subject<number> = new Subject();
  private canLoadMore: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private readonly dispose$: Subject<void> = new Subject();
  private readonly stopLoading$: Subject<void> = new Subject<void>();

  protected constructor(injector: Injector) {
    this.likesService = injector.get(HubLikesService);
    this.notificationService = injector.get(NotificationService);
    this.postsService = injector.get(PostsService);
    this.spinnerService = injector.get(SpinnerService);
    this.translocoService = injector.get(TranslocoService);

    this.loadMore.pipe(
      tap(() => this.isLoading.next(true)),
      switchMap((count) => this.loadPosts(this.getLastPost(), count).pipe(
        map((posts) => posts.filter((post) => !!+post.createdAt)),
        tap((posts) => (posts.length < count) && this.canLoadMore.next(false)),
        takeUntil(this.stopLoading$),
        finalize(() => this.isLoading.next(false)),
      )),
      map((posts) => HubLikesService.patchPostsWithLikeMap(posts, this.likesService.likeMap$.value)),
      takeUntil(this.dispose$),
    ).subscribe((posts) => {
      this.pushPosts(posts);
    });

    HubPostsService.deleteNotifier$.pipe(
      takeUntil(this.dispose$),
    ).subscribe((postId) => {
      this.replacePost(postId, () => undefined);
    });

    this.likesService.likeMap$.pipe(
      takeUntil(this.dispose$),
    ).subscribe((likeMap) => {
      this.posts.next(HubLikesService.patchPostsWithLikeMap(this.posts.value, likeMap));
    });
  }

  public get posts$(): Observable<T[]> {
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

  public loadMorePosts(count: number = this.loadingMoreCount): void {
    this.loadMore.next(count);
  }

  public loadInitialPosts(count: number = this.loadingInitialCount): void {
    this.loadMorePosts(count);
  }

  public getPostChanges(postId: T['uuid']): Observable<T> {
    return this.posts$.pipe(
      map(() => this.getPost(postId)),
      distinctUntilChanged((prev, curr) => !prev && !curr),
    );
  }

  public deletePost(post: Pick<PostsListItem, 'owner' | 'uuid'>): Observable<void> {
    this.spinnerService.showSpinner();

    return this.postsService.deletePost(post).pipe(
      tap(() => {
        this.notificationService.success(this.translocoService.translate('hub.notifications.delete.success'));
        HubPostsService.deleteNotifier$.next(post.uuid);
      }),
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
      takeUntil(this.dispose$),
      finalize(() => this.spinnerService.hideSpinner()),
    );
  }

  public getPost(postId: T['uuid']): T {
    return this.posts.value.find((post) => post.uuid === postId);
  }

  public reload(): void {
    this.clear();
    this.loadMorePosts(this.loadingInitialCount);
  }

  public clear(): void {
    this.stopLoading$.next();
    this.posts.next([]);
    this.canLoadMore.next(true);
  }

  public dispose(): void {
    this.dispose$.next();
    this.dispose$.complete();
  }

  public trackByPostId: TrackByFunction<T> = ({}, { uuid }) => uuid;

  protected abstract loadPosts(fromPost: T | undefined, count: number): Observable<T[]>;

  private getLastPost(): T | undefined {
    return this.posts.value[this.posts.value.length - 1];
  }

  private pushPosts(posts: T[]): void {
    const currentPosts = this.posts.value;
    this.posts.next([...currentPosts, ...posts]);
  }

  private replacePost(
    postId: T['uuid'],
    updateFn: (post: T) => T | undefined,
  ): void {
    const postIndex = this.posts.value.findIndex((post) => post.uuid === postId);

    if (postIndex === -1) {
      return;
    }

    const postToUpdate = this.posts.value[postIndex];
    const newPost = updateFn(postToUpdate);

    this.posts.next([
      ...this.posts.value.slice(0, postIndex),
      ...newPost ? [newPost] : [],
      ...this.posts.value.slice(postIndex + 1),
    ]);
  }
}
