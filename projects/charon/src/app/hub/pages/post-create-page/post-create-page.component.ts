import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { from, interval, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FormControl } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PostCreate } from 'decentr-js';

import { ONE_SECOND } from '@shared/utils/date';
import { svgPublish } from '@shared/svg-icons';
import { HUB_HEADER_ACTIONS_SLOT } from '../../components/hub-header';
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
  public readonly headerActionsSlotName = HUB_HEADER_ACTIONS_SLOT;

  public postControl: FormControl<PostCreate> = new FormControl();

  public invalid$: Observable<boolean>;

  constructor(
    private postCreatePageService: PostCreatePageService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register(svgPublish);
  }

  public ngOnInit() {
    from(this.postCreatePageService.getDraft()).pipe(
      untilDestroyed(this),
    ).subscribe((draft) => this.postControl.setValue(draft));

    this.createAutoSaveObservable().pipe(
      untilDestroyed(this),
    ).subscribe();

    this.invalid$ = this.postControl.status$.pipe(
      map(() => this.postControl.invalid),
    );
  }

  public createPost(): void {
    this.postCreatePageService.createPost(this.postControl.value).pipe(
      untilDestroyed(this),
    ).subscribe();
  }

  private createAutoSaveObservable(): Observable<void> {
    return interval(ONE_SECOND * 10).pipe(
      switchMap(() => this.postCreatePageService.saveDraft(this.postControl.value)),
    );
  }
}
