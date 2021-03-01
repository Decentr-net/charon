import { Injector, TrackByFunction } from '@angular/core';
import { BehaviorSubject, EMPTY, forkJoin, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { LikeWeight, Post, PublicProfile } from 'decentr-js';

import { NotificationService } from '@shared/services/notification';
import { createSharedOneValueObservable } from '@shared/utils/observable';
import { TranslatedError } from '@core/notifications';
import { PostsService, SpinnerService, UserService } from '../../core/services';
import { PostWithAuthor, PostWithLike } from '../models/post';

export abstract class HubPostsService<T extends PostWithLike = PostWithAuthor> {
  protected readonly notificationService: NotificationService;
  protected readonly postsService: PostsService;
  protected readonly spinnerService: SpinnerService;
  protected readonly translocoService: TranslocoService;
  protected readonly userService: UserService;

  protected loadingMoreCount: number = 4;
  protected loadingInitialCount: number = 4;
  protected includeProfile: boolean = true;

  private posts: BehaviorSubject<T[]> = new BehaviorSubject([]);
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private loadMore: Subject<number> = new Subject();
  private canLoadMore: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private readonly dispose$: Subject<void> = new Subject();
  private readonly stopLoading$: Subject<void> = new Subject<void>();

  private readonly profileMap: Map<Post['owner'], Observable<PublicProfile>> = new Map();

  private static deleteNotifier$: Subject<Post['uuid']> = new Subject();
  private static reloadNotifier$: Subject<void> = new Subject();

  protected constructor(
    injector: Injector,
  ) {
    this.notificationService = injector.get(NotificationService);
    this.postsService = injector.get(PostsService);
    this.spinnerService = injector.get(SpinnerService);
    this.translocoService = injector.get(TranslocoService);
    this.userService = injector.get(UserService);

    this.loadMore.pipe(
      tap(() => this.isLoading.next(true)),
      switchMap((count) => this.loadFullPosts(this.getLastPost(), count).pipe(
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

  public getPostChanges(postId: Post['uuid']): Observable<T> {
    return this.posts$.pipe(
      map(() => this.getPost(postId)),
    );
  }

  public deletePost(post: Post): Observable<void> {
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

  public getPost(postId: Post['uuid']): T {
    return this.posts.value.find((post) => post.uuid === postId);
  }

  public likePost(postId: Post['uuid'], likeWeight: LikeWeight): Observable<void> {
    const post = this.getPost(postId);

    const update: Partial<Pick<PostWithAuthor, 'likeWeight' | 'likesCount' | 'dislikesCount'>> = {
      ...HubPostsService.getPostLikesCountUpdate(post, likeWeight),
      likeWeight,
    };

    this.updatePost(postId, update);

    return this.postsService.likePost(post, likeWeight).pipe(
      catchError((error) => {
        this.notificationService.error(error);

        return of(void 0);
      }),
      mergeMap(() => this.updatePostLive(postId)),
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

  public getPublicProfile(walletAddress: Post['owner']): Observable<PublicProfile> {
    if (!this.profileMap.has(walletAddress)) {
      this.profileMap.set(
        walletAddress,
        createSharedOneValueObservable(this.userService.getPublicProfile(walletAddress)),
      );
    }

    return this.profileMap.get(walletAddress);
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;

  protected abstract loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]>;

  private getLastPost(): T | undefined {
    return this.posts.value[this.posts.value.length - 1];
  }

  private updatePostLive(postId: Post['uuid']): Observable<void> {
    const oldPost = this.getPost(postId);

    return this.postsService.getPost(oldPost).pipe(
      mergeMap((post) => {
        if (!+post.createdAt) {
            this.notificationService.error(
              new TranslatedError(this.translocoService.translate('hub.notifications.not_exists')),
            );

            HubPostsService.deleteNotifier$.next(postId);
            return of(void 0);
        }

        return this.updatePostsWithLikes([post]).pipe(
          map((posts) => posts[0]),
          tap((post) => this.updatePost(postId, post)),
        );
      }),
    );
  }

  private pushPosts(posts: T[]): void {
    const currentPosts = this.posts.value;
    this.posts.next([...currentPosts, ...posts]);
  }

  private replacePost(
    postId: Post['uuid'],
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
    postId: Post['uuid'],
    update: Partial<Omit<Post, 'uuid'>>,
  ): void {
    this.replacePost(postId, (post) => ({
      ...post,
      ...update,
    }));
  }

  public updatePostsWithAuthors<T extends Post>(
    posts: T[],
  ): Observable<(T & { author: PublicProfile })[]> {
    if (!posts.length) {
      return of([]);
    }

    return forkJoin(
      posts.map((post) => this.getPublicProfile(post.owner).pipe(
        map((publicProfile) => ({
          ...post,
          author: publicProfile,
        })),
      )),
    );
  }

  public updatePostsWithLikes<T extends Post>(
    posts: T[],
  ): Observable<(T & { likeWeight: LikeWeight })[]> {
    if (!posts.length) {
      return of([]);
    }

    return this.postsService.getLikedPosts().pipe(
      map((likedPosts) => posts.map((post) => {
        const likeWeight = likedPosts[`${post.owner}/${post.uuid}`] || 0;

        return {
          ...post,
          likeWeight,
        };
      })),
    );
  }

  private loadFullPosts(fromPost: Post, count: number): Observable<T[]> {
    return this.loadPosts(fromPost, count).pipe(
      map((posts) => {
        return posts
          .filter((post) => !!+post.createdAt)
          .sort((left, right) => right.pdv - left.pdv || right.createdAt - left.createdAt);
      }),
      mergeMap((posts: Post[]) => this.includeProfile ? this.updatePostsWithAuthors(posts) : of(posts)),
      mergeMap((posts: T[]) => this.updatePostsWithLikes(posts)),
    );
  }

  public static getPostLikesCountUpdate<T extends PostWithLike>(
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
