import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { PostCreate } from 'decentr-js';

import { BrowserLocalStorage } from '@shared/services/browser-storage';
import { AuthService } from '@core/auth';
import { NetworkService } from '@core/services';
import { PostsApiService } from '@core/services/api';

interface PostStorageValue {
  draft: PostCreate;
}

@Injectable()
export class HubCreatePostService {
  private postStorage = BrowserLocalStorage
    .getInstance()
    .useSection<PostStorageValue>('post');

  private postCreated: Subject<void> = new Subject();

  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
    private postsApiService: PostsApiService,
  ) {
  }

  public get postCreated$(): Observable<void> {
    return this.postCreated;
  }

  public getDraft(): Promise<PostCreate> {
    return this.postStorage.pop('draft');
  }

  public saveDraft(post: PostCreate): Promise<void> {
    return this.postStorage.set('draft', post);
  }

  public createPost(post: PostCreate): Observable<void> {
    const api = this.networkService.getActiveNetworkInstant().api;

    const wallet = this.authService.getActiveUserInstant().wallet;

    return this.postsApiService.createPost(api, wallet.address, wallet.privateKey, post)
      .pipe(
        tap(() => this.postCreated.next()),
        mapTo(void 0),
      );
  }
}
