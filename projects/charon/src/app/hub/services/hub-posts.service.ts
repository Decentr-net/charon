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
import { LikeWeight, Post, PublicProfile } from 'decentr-js';

import { NotificationService } from '@shared/services/notification';
import { createSharedOneValueObservable } from '@shared/utils/observable';
import { TranslatedError } from '@core/notifications';
import { PostsListItem, PostsService, SpinnerService, UserService } from '@core/services';

export abstract class HubPostsService<T extends PostsListItem = PostsListItem> {
  protected readonly notificationService: NotificationService;
  protected readonly postsService: PostsService;
  protected readonly spinnerService: SpinnerService;
  protected readonly translocoService: TranslocoService;
  protected readonly userService: UserService;

  protected loadingMoreCount: number = 4;
  protected loadingInitialCount: number = 4;

  private posts: BehaviorSubject<T[]> = new BehaviorSubject([]);
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private loadMore: Subject<number> = new Subject();
  private canLoadMore: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private readonly dispose$: Subject<void> = new Subject();
  private readonly stopLoading$: Subject<void> = new Subject<void>();

  private readonly profileMap: Map<T['owner'], Observable<PublicProfile>> = new Map();

  private static deleteNotifier$: Subject<Post['uuid']> = new Subject();
  private static reloadNotifier$: Subject<void> = new Subject();

  protected constructor(injector: Injector) {
    this.notificationService = injector.get(NotificationService);
    this.postsService = injector.get(PostsService);
    this.spinnerService = injector.get(SpinnerService);
    this.translocoService = injector.get(TranslocoService);
    this.userService = injector.get(UserService);

    this.loadMore.pipe(
      tap(() => this.isLoading.next(true)),
      switchMap((count) => this.loadPosts(this.getLastPost(), count).pipe(
        map((posts) => posts.filter((post) => !!+post.createdAt)),
        tap((posts) => (posts.length < count) && this.canLoadMore.next(false)),
        takeUntil(this.stopLoading$),
        finalize(() => this.isLoading.next(false)),
      )),
      takeUntil(this.dispose$),
    ).subscribe((posts) => {
      this.pushPosts(posts);
    });

    HubPostsService.reloadNotifier$.pipe(
      takeUntil(this.dispose$),
    ).subscribe(() => {
      this.reload();
    });

    HubPostsService.deleteNotifier$.pipe(
      takeUntil(this.dispose$),
    ).subscribe((postId) => {
      this.replacePost(postId, () => undefined);
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

    return this.postsService.deletePost({
      author: post.owner,
      postId: post.uuid,
    }).pipe(
      tap(() => {
        this.notificationService.success(this.translocoService.translate('hub.notifications.delete.success'));
        HubPostsService.reloadNotifier$.next();
      }),
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
      takeUntil(this.dispose$),
      finalize(() => this.spinnerService.hideSpinner()),
    );
  };

  public getPost(postId: T['uuid']): T {
    return this.posts.value.find((post) => post.uuid === postId);
  }

  public likePost(postId: T['uuid'], likeWeight: LikeWeight): Observable<void> {
    const post = this.getPost(postId);

    const update: Partial<Pick<T, 'likeWeight' | 'likesCount' | 'dislikesCount'>> = {
      ...HubPostsService.getPostLikesCountUpdate(post, likeWeight),
      likeWeight,
    };

    this.updatePost(postId, update as T);

    return this.postsService.likePost(post, likeWeight).pipe(
      catchError((error) => {
        this.notificationService.error(error);

        return this.updatePostLive(postId);
      }),
    );
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

  public getPublicProfile(walletAddress: T['owner']): Observable<PublicProfile> {
    if (!this.profileMap.has(walletAddress)) {
      this.profileMap.set(
        walletAddress,
        createSharedOneValueObservable(this.userService.getPublicProfile(walletAddress)),
      );
    }

    return this.profileMap.get(walletAddress);
  }

  public trackByPostId: TrackByFunction<T> = ({}, { uuid }) => uuid;

  protected abstract loadPosts(fromPost: T | undefined, count: number): Observable<T[]>;

  private getLastPost(): T | undefined {
    return this.posts.value[this.posts.value.length - 1];
  }

  private updatePostLive(postId: T['uuid']): Observable<void> {
    const oldPost = this.getPost(postId);

    return this.postsService.getPost(oldPost).pipe(
      map((post) => {
        if (!+post.createdAt) {
            this.notificationService.error(
              new TranslatedError(this.translocoService.translate('hub.notifications.not_exists')),
            );

            HubPostsService.deleteNotifier$.next(postId);
            return undefined;
        }

        this.updatePost(postId, post as T);
      }),
    );
  }

  private pushPosts(posts: T[]): void {
    const currentPosts = this.posts.value;
    this.posts.next([...currentPosts, ...posts]);
  }

  private replacePost(
    postId: T['uuid'],
    updateFn: (post: T) => T | undefined,
  ) {
    const postIndex = this.posts.value.findIndex((post) => post.uuid === postId);
    const post = this.posts.value[postIndex];
    const newPost = updateFn(post);

    this.posts.next([
      ...this.posts.value.slice(0, postIndex),
      ...newPost ? [newPost] : [],
      ...this.posts.value.slice(postIndex + 1),
    ]);
  }

  private updatePost(
    postId: T['uuid'],
    update: Partial<Omit<T, 'uuid'>>,
  ): void {
    this.replacePost(postId, (post) => ({
      ...post,
      ...update,
    }));
  }

  public static getPostLikesCountUpdate<T extends PostsListItem>(
    post: T,
    newLikeWeight: LikeWeight,
  ): Partial<Pick<T, 'likesCount' | 'dislikesCount'>> {
    switch (post.likeWeight) {
      case LikeWeight.Up:
        switch (newLikeWeight) {
          case LikeWeight.Up:
            return {};
          case LikeWeight.Zero:
            return {
              likesCount: post.likesCount - 1,
            };
          case LikeWeight.Down:
            return {
              likesCount: post.likesCount - 1,
              dislikesCount: post.dislikesCount + 1,
            };
        }
        break;
      case LikeWeight.Down:
        switch (newLikeWeight) {
          case LikeWeight.Up:
            return {
              likesCount: post.likesCount + 1,
              dislikesCount: post.dislikesCount - 1,
            };
          case LikeWeight.Zero:
            return {
              dislikesCount: post.dislikesCount - 1,
            };
          case LikeWeight.Down:
            return {};
        }
        break;
      case LikeWeight.Zero:
        switch (newLikeWeight) {
          case LikeWeight.Up:
            return {
              likesCount: post.likesCount + 1,
            };
          case LikeWeight.Down:
            return {
              dislikesCount: post.dislikesCount + 1,
            };
        }
    }
  }
}
