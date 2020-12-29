import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LikeWeight } from 'decentr-js';

import { svgLike } from '@shared/svg-icons';
import { PostWithAuthor } from '../../models/post';
import { HubLikesService } from '../../services';

@UntilDestroy()
@Component({
  selector: 'app-hub-post-rating',
  templateUrl: './hub-post-rating.component.html',
  styleUrls: ['./hub-post-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    HubLikesService,
  ],
})
export class HubPostRatingComponent implements OnInit {
  @Input() public postId: PostWithAuthor['uuid'];

  public post$: Observable<PostWithAuthor>;

  public readonly likeWeight: typeof LikeWeight = LikeWeight;

  public isDisabled$: Observable<boolean>;

  constructor(
    private hubLikesService: HubLikesService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register(svgLike);
  }

  @HostListener('click', ['$event'])
  public onClick(event: Event): void
  {
    event.stopPropagation();
  }

  public ngOnInit(): void {
    this.post$ = this.hubLikesService.getPostChanges(this.postId);

    this.isDisabled$ = this.hubLikesService.canLikePost(this.postId).pipe(
      map((canLike) => !canLike),
      shareReplay(1),
    );
  }

  public onLike(post: PostWithAuthor): void {
    this.changeLikeWeight(post, LikeWeight.Up);
  }

  public onDislike(post: PostWithAuthor): void {
    this.changeLikeWeight(post, LikeWeight.Down);
  }

  private changeLikeWeight(post: PostWithAuthor, newLikeWeight: LikeWeight): void {
    this.hubLikesService.likePost(
      this.postId,
      post.likeWeight === newLikeWeight
        ? LikeWeight.Zero
        : newLikeWeight
    ).pipe(
      untilDestroyed(this),
    ).subscribe();
  }
}
