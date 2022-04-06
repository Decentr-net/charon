import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, finalize, mergeMap, tap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { CreatePostRequest, Wallet } from 'decentr-js';

import { BrowserLocalStorage } from '@shared/services/browser-storage';
import { NotificationService } from '@shared/services/notification';
import { AuthService } from '@core/auth/services';
import { PostsService, SpinnerService } from '@core/services';
import { HubPostsPdvFilterService } from '../../services';

interface PostStorageValue {
  draft: Record<Wallet['address'], CreatePostRequest>;
}

@Injectable()
export class PostCreatePageService {
  private postStorage = BrowserLocalStorage
    .getInstance()
    .useSection<PostStorageValue>('post');

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private postsService: PostsService,
    private postsPdvFilterService: HubPostsPdvFilterService,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
  ) {
  }

  public getDraft(): Promise<CreatePostRequest> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    return this.postStorage.get('draft').then((draft) => draft && draft[walletAddress]);
  }

  public async saveDraft(post: CreatePostRequest): Promise<void> {
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

  public createPost(post: CreatePostRequest): Observable<void> {
    this.spinnerService.showSpinner();

    return this.postsService.createPost(post).pipe(
      catchError((error) => {
        this.notificationService.error(error);

        return EMPTY;
      }),
      mergeMap(() => this.removeDraft()),
      tap(() => {
        this.postsPdvFilterService.resetFilter();

        this.notificationService.success(
          this.translocoService.translate('notifications.create.success', null, 'hub')
        );
      }),
      finalize(() => this.spinnerService.hideSpinner()),
    );
  }
}
