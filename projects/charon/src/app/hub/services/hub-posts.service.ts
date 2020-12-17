import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, finalize, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Post, PublicProfile } from 'decentr-js';

import { createSharedOneValueObservable } from '@shared/utils/observable';
import { PostWithAuthor } from '../models/post';

interface HubUserService {
  getPublicProfile(walletAddress: Post['owner']): Observable<PublicProfile>;
}

export abstract class HubPostsService {
  private posts: BehaviorSubject<PostWithAuthor[]> = new BehaviorSubject([]);
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private loadMore: Subject<number> = new Subject();
  private canLoadMore: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private readonly dispose$: Subject<void> = new Subject();
  private readonly stopLoading$: Subject<void> = new Subject<void>();

  private readonly profileMap: Map<Post['owner'], Observable<PublicProfile>> = new Map();

  protected constructor(
    private hubUserService: HubUserService,
  ) {
    this.loadMore.pipe(
      tap(() => this.isLoading.next(true)),
      switchMap((count) => this.loadPosts(this.getLastPost(), count).pipe(
        mergeMap((posts) => this.updatePostsWithAuthors(posts)),
        tap((posts) => (posts.length < count) && this.canLoadMore.next(false)),
        takeUntil(this.stopLoading$),
        finalize(() => this.isLoading.next(false)),
      )),
      takeUntil(this.dispose$),
    ).subscribe((posts) => {
      this.pushPosts(posts);
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

  public loadMorePosts(count: number): void {
    this.loadMore.next(count);
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

  private pushPosts(posts: PostWithAuthor[]): void {
    const currentPosts = this.posts.value;
    this.posts.next([...currentPosts, ...posts]);
  }

  private getPublicProfile(walletAddress: Post['owner']): Observable<PublicProfile> {
    if (!this.profileMap.has(walletAddress)) {
      this.profileMap.set(
        walletAddress,
        createSharedOneValueObservable(this.hubUserService.getPublicProfile(walletAddress)),
      );
    }

    return this.profileMap.get(walletAddress);
  }

  private updatePostsWithAuthors(posts: Post[]): Observable<PostWithAuthor[]> {
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
}
