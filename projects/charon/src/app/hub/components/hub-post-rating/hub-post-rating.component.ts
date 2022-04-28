import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { fromEvent, ReplaySubject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LikeWeight } from 'decentr-js';

import { PostsListItem } from '@core/services';
import { CanLikeState, HubLikesService } from '../../services';
import { svgLike } from '@shared/svg-icons/like';

@UntilDestroy()
@Component({
  selector: 'app-hub-post-rating',
  templateUrl: './hub-post-rating.component.html',
  styleUrls: ['./hub-post-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostRatingComponent implements OnInit {
  @Input() public set post(value: PostsListItem) {
    this.post$.next(value);
  }

  @Input() @HostBinding('class.mod-filled') public filled = false;

  public post$: ReplaySubject<PostsListItem> = new ReplaySubject(1);

  public readonly likeWeight: typeof LikeWeight = LikeWeight;

  public canLikeState: CanLikeState = 'enabled';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private hubLikesService: HubLikesService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgLike,
    ]);
  }

  public ngOnInit(): void {
    fromEvent(this.elementRef.nativeElement, 'click').pipe(
      untilDestroyed(this),
    ).subscribe((event) => event.stopPropagation());

    this.post$.pipe(
      switchMap((post) => this.hubLikesService.canLikePost(post.owner)),
      untilDestroyed(this),
    ).subscribe((canLikeState) => {
      this.canLikeState = canLikeState;
      this.changeDetectorRef.markForCheck();
    });
  }

  @HostBinding('class.is-disabled')
  public get isDisabled(): boolean {
    return this.canLikeState === 'disabled';
  }

  @HostBinding('class.is-updating')
  public get isUpdating(): boolean {
    return this.canLikeState === 'updating';
  }

  public onLike(post: PostsListItem): void {
    if (this.canLikeState === 'enabled') {
      this.changeLikeWeight(post, LikeWeight.LIKE_WEIGHT_UP);
    }
  }

  public onDislike(post: PostsListItem): void {
    if (this.canLikeState === 'enabled') {
      this.changeLikeWeight(post, LikeWeight.LIKE_WEIGHT_DOWN);
    }
  }

  private changeLikeWeight(post: PostsListItem, newLikeWeight: LikeWeight): void {
    this.hubLikesService.likePost(
      post,
      post.likeWeight === newLikeWeight
        ? LikeWeight.LIKE_WEIGHT_ZERO
        : newLikeWeight,
    ).pipe(
      take(1),
    ).subscribe();
  }
}
