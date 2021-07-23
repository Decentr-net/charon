import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, finalize, mergeMap, tap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { PostCreate, Wallet } from 'decentr-js';

import { BrowserLocalStorage } from '@shared/services/browser-storage';
import { NotificationService } from '@shared/services/notification';
import { AuthService } from '@core/auth/services';
import { PostsService, SpinnerService } from '@core/services';

interface PostStorageValue {
  draft: Record<Wallet['address'], PostCreate>;
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
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
  ) {
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
    this.spinnerService.showSpinner();

    return this.postsService.createPost(post).pipe(
      catchError((error) => {
        this.notificationService.error(error);

        return EMPTY;
      }),
      mergeMap(() => this.removeDraft()),
      tap(() => {
        this.notificationService.success(
          this.translocoService.translate('notifications.create.success', null, 'hub')
        );
      }),
      finalize(() => this.spinnerService.hideSpinner()),
    );
  }
}
