import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { PostCreate } from 'decentr-js';

import { BrowserLocalStorage } from '@shared/services/browser-storage';
import { AuthService } from '@core/auth';
import { NetworkSelectorService } from '@core/network-selector';
import { PostsApiService } from '@core/services/api';

interface PostStorageValue {
  draft: PostCreate;
}

@Injectable()
export class HubCreatePostService {
  private postStorage = BrowserLocalStorage
    .getInstance()
    .useSection<PostStorageValue>('post');

  constructor(
    private authService: AuthService,
    private networkService: NetworkSelectorService,
    private postsApiService: PostsApiService,
  ) {
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
        mapTo(void 0),
      );
  }
}
