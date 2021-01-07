import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { PostCreate } from 'decentr-js';

import { BrowserLocalStorage } from '@shared/services/browser-storage';
import { PostsService } from '@core/services';

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
    private postsService: PostsService,
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
    return this.postsService.createPost(post)
      .pipe(
        tap(() => this.postCreated.next()),
        mapTo(void 0),
      );
  }
}
