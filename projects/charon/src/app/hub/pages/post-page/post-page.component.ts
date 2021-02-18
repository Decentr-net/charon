import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck, share } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Post } from 'decentr-js';

import { PostWithAuthor, PostWithLike } from '../../models/post';
import { PostPageService } from './post-page.service';
import { PostPageRelatedService } from './post-page-related.service';
import { HubLikesService } from '../../services';
import { HubProfile } from '../../components/hub-profile-card';

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
      useExisting: PostPageRelatedService,
    },
    PostPageRelatedService,
  ],
})
export class PostPageComponent implements OnInit {
  public post$: Observable<PostWithAuthor>;

  public authorProfile: HubProfile;

  public relatedPosts$: Observable<PostWithLike[]>;

  public trackByPostId: TrackByFunction<Post> = this.postPageRelatedService.trackByPostId;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private postPageService: PostPageService,
    private postPageRelatedService: PostPageRelatedService,
  ) {
  }

  public ngOnInit(): void {
    this.post$ = this.postPageService.getPost().pipe(
      share(),
    );

    this.post$.pipe(
      pluck('category'),
      untilDestroyed(this),
    ).subscribe((category) => this.postPageRelatedService.setCategory(category));

    this.relatedPosts$ = this.postPageRelatedService.posts$;

    this.post$.pipe(
      untilDestroyed(this),
    ).subscribe((post) => {
      this.authorProfile = {
        ...post.author,
        walletAddress: post.owner,
      };

      this.changeDetectorRef.markForCheck();
    });
  }
}
