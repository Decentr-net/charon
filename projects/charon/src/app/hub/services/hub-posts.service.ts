import { Injector } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
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
import { LikeWeight, Post, PublicProfile } from 'decentr-js';

import { NotificationService } from '@shared/services/notification';
import { createSharedOneValueObservable } from '@shared/utils/observable';
import { PostsService, SpinnerService, UserService } from '../../core/services';
import { PostWithAuthor } from '../models/post';
import { HubCreatePostService } from './hub-create-post.service';
import { TranslocoService } from '@ngneat/transloco';

export abstract class HubPostsService {
  protected readonly createPostService: HubCreatePostService;
  protected readonly notificationService: NotificationService;
  protected readonly postsService: PostsService;
  protected readonly spinnerService: SpinnerService;
  protected readonly translocoService: TranslocoService;
  protected readonly userService: UserService;

  protected abstract loadingCount: number;
  protected shouldReloadOnLike: boolean = false;

  private posts: BehaviorSubject<PostWithAuthor[]> = new BehaviorSubject([]);
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private loadMore: Subject<number> = new Subject();
  private canLoadMore: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private readonly dispose$: Subject<void> = new Subject();
  private readonly stopLoading$: Subject<void> = new Subject<void>();

  private readonly profileMap: Map<Post['owner'], Observable<PublicProfile>> = new Map();

  static reloadNotifier$: Subject<void> = new Subject();

  protected constructor(
    injector: Injector,
  ) {
    this.createPostService = injector.get(HubCreatePostService);
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

    this.createPostService.postCreated$.pipe(
      takeUntil(this.dispose$),
    ).subscribe(() => {
      HubPostsService.reloadNotifier$.next();
    });

    HubPostsService.reloadNotifier$.pipe(
      takeUntil(this.dispose$),
    ).subscribe(() => {
      this.reload();
    });
  }

  public get posts$(): Observable<PostWithAuthor[]> {
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

  public loadMorePosts(count: number = this.loadingCount): void {
    this.loadMore.next(count);
  }

  public getPostChanges(postId: Post['uuid']): Observable<PostWithAuthor> {
    return this.posts$.pipe(
      map(() => this.getPost(postId)),
    );
  }

  public deletePost(
    post: Post,
  ) {
    this.spinnerService.showSpinner();

    this.postsService.deletePost({
      author: post.owner,
      postId: post.uuid,
    }).pipe(
      takeUntil(this.dispose$),
      finalize(() => {
        this.spinnerService.hideSpinner();

        HubPostsService.reloadNotifier$.next();
      })
    ).subscribe(
      () => {
        this.notificationService.success(this.translocoService.translate('hub.notifications.delete.success'));
    }, (error) => {
        this.notificationService.error(error);
      });
  };

  public getPost(postId: Post['uuid']): PostWithAuthor {
    return this.posts.value.find((post) => post.uuid === postId);
  }

  public likePost(postId: Post['uuid'], likeWeight: LikeWeight): Observable<void> {
    const post = this.getPost(postId);

    const update: Partial<Pick<PostWithAuthor, 'likeWeight' | 'likesCount' | 'dislikesCount'>> = {
      ...this.getPostLikesCountUpdate(post, likeWeight),
      likeWeight,
    };

    this.updatePost(postId, update);

    return this.postsService.likePost(post, likeWeight).pipe(
      tap(() => {
        if (this.shouldReloadOnLike) {
          this.reload();
        }
      }),
      catchError((error) => {
        this.notificationService.error(error);

        return of(void 0);
      }),
      mergeMap(() => this.updatePostLive(postId)),
    );
  }

  public reload(): void {
    this.clear();
    this.loadMorePosts();
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

  protected abstract loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]>;

  private getLastPost(): PostWithAuthor | undefined {
    return this.posts.value[this.posts.value.length - 1];
  }

  private updatePostLive(postId: Post['uuid']): Observable<void> {
    const oldPost = this.getPost(postId);

    return this.postsService.getPost(oldPost).pipe(
      mergeMap((post) => {
        if (!post.createdAt) {
            this.notificationService.error(
              this.translocoService.translate('hub.notifications.not_exists')
            );
            this.replacePost(postId, () => undefined);
            return of(void 0);
        }

        return this.updatePostsWithLikes([post]).pipe(
          map((posts) => posts[0]),
          tap((post) => this.updatePost(postId, post)),
        );
      }),
    );
  }

  private pushPosts(posts: PostWithAuthor[]): void {
    const currentPosts = this.posts.value;
    this.posts.next([...currentPosts, ...posts]);
  }

  private getPublicProfile(walletAddress: Post['owner']): Observable<PublicProfile> {
    if (!this.profileMap.has(walletAddress)) {
      this.profileMap.set(
        walletAddress,
        createSharedOneValueObservable(this.userService.getPublicProfile(walletAddress)),
      );
    }

    return this.profileMap.get(walletAddress);
  }

  private replacePost(
    postId: Post['uuid'],
    updateFn: (post: PostWithAuthor) => PostWithAuthor | undefined,
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

  private updatePostsWithAuthors<T extends Post>(
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

  private updatePostsWithLikes<T extends Post>(
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

  private loadFullPosts(fromPost: Post, count: number): Observable<PostWithAuthor[]> {
    return this.loadPosts(fromPost, count).pipe(
      map((posts) => posts.filter((post) => !!+post.createdAt)),
      mergeMap((posts) => this.updatePostsWithAuthors(posts)),
      mergeMap((posts) => this.updatePostsWithLikes(posts)),
    );
  }

  private getPostLikesCountUpdate(
    post: PostWithAuthor,
    newLikeWeight: LikeWeight,
  ): Partial<Pick<PostWithAuthor, 'likesCount' | 'dislikesCount'>> {
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
