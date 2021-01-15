import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { PostCreate, Wallet } from 'decentr-js';

import { AuthService } from '@core/auth/services';
import { BrowserLocalStorage } from '@shared/services/browser-storage';
import { PostsService } from '@core/services';

interface PostStorageValue {
  draft: Record<Wallet['address'], PostCreate>;
}

@Injectable()
export class HubCreatePostService {
  private postStorage = BrowserLocalStorage
    .getInstance()
    .useSection<PostStorageValue>('post');

  private postCreated: Subject<void> = new Subject();

  constructor(
    private authService: AuthService,
    private postsService: PostsService,
  ) {
  }

  public get postCreated$(): Observable<void> {
    return this.postCreated;
  }

  public getDraft(): Promise<PostCreate> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    return this.postStorage.get('draft').then((draft) => draft && draft[walletAddress]);
  }

  public async saveDraft(post: PostCreate): Promise<void> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;
    const prevDraft = await this.postStorage.get('draft');

    return this.postStorage.set('draft', {
      ...prevDraft,
      [walletAddress]: post,
    });
  }

  public removeDraft(): Promise<void> {
    return this.saveDraft(undefined);
  }

  public createPost(post: PostCreate): Observable<void> {
    return this.postsService.createPost(post)
      .pipe(
        tap(() => this.postCreated.next()),
        mapTo(void 0),
      );
  }
}
