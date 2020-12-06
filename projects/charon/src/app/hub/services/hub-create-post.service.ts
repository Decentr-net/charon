import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { BrowserLocalStorage } from '@shared/services/browser-storage';
import { AuthService } from '@core/auth';
import { NetworkSelectorService } from '@core/network-selector';
import { PostsApiService } from '@core/services/api';
import { HubCreatePostDialogPost, HubCreatePostDialogResult } from '../components/hub-create-post-dialog';

interface PostStorageValue {
  draft: HubCreatePostDialogResult['post'];
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

  public getDraft(): Promise<HubCreatePostDialogPost> {
    return this.postStorage.pop('draft');
  }

  public saveDraft(post: HubCreatePostDialogPost): Promise<void> {
    return this.postStorage.set('draft', post);
  }

  public createPost(post: HubCreatePostDialogPost): Observable<void> {
    const api = this.networkService.getActiveNetworkInstant().api;

    const wallet = this.authService.getActiveUserInstant().wallet;

    return this.postsApiService.createPost(api, wallet.address, wallet.privateKey, {
      ...post,
      previewImage: this.extractPreviewImage(post.text),
    }).pipe(
      mapTo(void 0),
    );
  }

  private extractPreviewImage(html: string): string | undefined {
    return '';
  }
}
