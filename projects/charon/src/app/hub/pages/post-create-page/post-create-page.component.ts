import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from, interval, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormControl } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CreatePostRequest } from 'decentr-js';

import { ONE_SECOND } from '@shared/utils/date';
import { svgPublish } from '@shared/svg-icons/publish';
import { AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT, AuthorizedLayoutComponent } from '@core/layout/authorized-layout';
import { AppRoute } from '../../../app-route';
import { HubRoute } from '../../hub-route';
import { PostCreatePageService } from './post-create-page.service';

@UntilDestroy()
@Component({
  selector: 'app-post-create-page',
  templateUrl: './post-create-page.component.html',
  styleUrls: ['./post-create-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PostCreatePageService,
  ],
})
export class PostCreatePageComponent implements OnInit {
  public readonly headerActionsSlotName = AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT;

  public formId = 'POST_CREATE_FORM';

  public postControl: FormControl<CreatePostRequest> = new FormControl();

  constructor(
    private layout: AuthorizedLayoutComponent,
    private postCreatePageService: PostCreatePageService,
    private router: Router,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgPublish,
    ]);
  }

  public ngOnInit(): void {
    from(this.postCreatePageService.getDraft()).pipe(
      untilDestroyed(this),
    ).subscribe((draft) => this.postControl.setValue(draft));

    this.createAutoSaveObservable().pipe(
      untilDestroyed(this),
    ).subscribe();
  }

  public createPost(): void {
    if (this.postControl.invalid) {
      this.layout.scrollToTop();
      return;
    }

    const post = this.postControl.value;

    this.postCreatePageService.createPost(post).pipe(
      untilDestroyed(this),
    ).subscribe(() => this.router.navigate([AppRoute.Hub, HubRoute.Posts, post.category]));
  }

  private createAutoSaveObservable(): Observable<void> {
    return interval(ONE_SECOND * 10).pipe(
      switchMap(() => this.postCreatePageService.saveDraft(this.postControl.value)),
    );
  }
}
