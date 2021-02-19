import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TrackByFunction
} from '@angular/core';
import { distinctUntilChanged, filter, pluck, share } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Post } from 'decentr-js';

import { PostWithAuthor } from '../../models/post';
import { PostPageService } from './post-page.service';
import { HubLikesService } from '../../services';
import { HubProfile } from '../../components/hub-profile-card';
import { PostPageLikeService } from './post-page-like.service';

@UntilDestroy()
@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PostPageService,
    {
      provide: HubLikesService,
      useClass: PostPageLikeService,
    },
  ],
})
export class PostPageComponent implements OnInit {
  public post: PostWithAuthor;

  public authorProfile: HubProfile;

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;

  public postLinkFn: (post: Post) => string[] = (post) => ['../../', post.owner, post.uuid];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private postPageService: PostPageService,
  ) {
  }

  public ngOnInit(): void {
    const post$ = this.postPageService.getPost().pipe(
      filter(post => !!post),
      share(),
    );

    post$.pipe(
      untilDestroyed(this),
    ).subscribe((post) => {
      this.post = post;

      this.authorProfile = {
        ...post.author,
        walletAddress: post.owner,
      };

      this.changeDetectorRef.markForCheck();
    });

    post$.pipe(
      pluck('uuid'),
      distinctUntilChanged(),
      untilDestroyed(this),
    ).subscribe(() => this.elementRef.nativeElement.scrollTop = 0);
  }
}
