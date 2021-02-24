import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { fromEvent, Observable, ReplaySubject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LikeWeight } from 'decentr-js';

import { svgLike } from '@shared/svg-icons';
import { CanLikeState, HubLikesService } from '../../services';
import { PostWithLike } from '../../models/post';

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
  @Input() public set postId(value: PostWithLike['uuid']) {
    this.postId$.next(value);
  }

  @Input() @HostBinding('class.mod-filled') public filled: boolean = false;

  @Input() private customHubLikesService: HubLikesService;

  public post$: Observable<PostWithLike>;

  public readonly likeWeight: typeof LikeWeight = LikeWeight;

  public canLikeState: CanLikeState = 'enabled';

  private hubLikesService: HubLikesService;

  private postId$: ReplaySubject<PostWithLike['uuid']> = new ReplaySubject(1);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private nativeHubLikesService: HubLikesService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register(svgLike);
  }

  public ngOnInit(): void {
    this.hubLikesService = this.customHubLikesService || this.nativeHubLikesService;

    fromEvent(this.elementRef.nativeElement, 'click').pipe(
      untilDestroyed(this),
    ).subscribe((event) => event.stopPropagation());

    this.post$ = this.postId$.pipe(
      switchMap((postId) => this.hubLikesService.getPostChanges(postId))
    );

    this.postId$.pipe(
      switchMap((postId) => this.hubLikesService.canLikePost(postId)),
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

  public onLike(post: PostWithLike): void {
    if (this.canLikeState === 'enabled') {
      this.changeLikeWeight(post, LikeWeight.Up);
    }
  }

  public onDislike(post: PostWithLike): void {
    if (this.canLikeState === 'enabled') {
      this.changeLikeWeight(post, LikeWeight.Down);
    }
  }

  private changeLikeWeight(post: PostWithLike, newLikeWeight: LikeWeight): void {
    // this subscription has no unsubscribe logic
    // to ensure the post was updated after some dialog (for ex) closed
    this.hubLikesService.likePost(
      post.uuid,
      post.likeWeight === newLikeWeight
        ? LikeWeight.Zero
        : newLikeWeight
    ).pipe(
      take(1),
    ).subscribe();
  }
}
