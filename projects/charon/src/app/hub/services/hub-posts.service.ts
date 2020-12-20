import { Injector } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  mapTo,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { LikeWeight, Post, PublicProfile } from 'decentr-js';

import { NotificationService } from '@shared/services/notification';
import { createSharedOneValueObservable } from '@shared/utils/observable';
import { PostsService, UserService } from '../../core/services';
import { PostWithAuthor } from '../models/post';
import { HubCreatePostService } from './hub-create-post.service';

export abstract class HubPostsService {
  protected readonly createPostService: HubCreatePostService;
  protected readonly notificationService: NotificationService;
  protected readonly postsService: PostsService;
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

  protected constructor(
    injector: Injector,
  ) {
    this.createPostService = injector.get(HubCreatePostService);
    this.notificationService = injector.get(NotificationService);
    this.postsService = injector.get(PostsService);
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

        this.updatePost(postId, post);

        return of(void 0);
      }),
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
    const index = this.posts.value.findIndex((post) => post.uuid === postId);
    const previousPost = this.posts.value[index - 1];

    return this.loadFullPosts(previousPost, 1)
      .pipe(
        map((posts) => posts[0]),
        tap((post) => this.updatePost(postId, post)),
        mapTo(void 0),
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

  private updatePost(
    postId: Post['uuid'],
    update: Partial<Omit<Post, 'uuid'>>,
  ): void {
    const postIndex = this.posts.value.findIndex((post) => post.uuid === postId);
    const post = this.posts.value[postIndex];

    this.posts.next([
      ...this.posts.value.slice(0, postIndex),
      {
        ...post,
        ...update,
      },
      ...this.posts.value.slice(postIndex + 1),
    ]);
  }

  private updatePostsWithAuthors(posts: Post[]): Observable<Omit<PostWithAuthor, 'likeWeight'>[]> {
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

  private updatePostsWithLikes(posts: Omit<PostWithAuthor, 'likeWeight'>[]): Observable<PostWithAuthor[]> {
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
