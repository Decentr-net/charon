import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Optional,
  SkipSelf
} from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LikeWeight } from 'decentr-js';

import { svgLike } from '@shared/svg-icons';
import { HubLikesService } from '../../services';
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
  @Input() public postId: PostWithLike['uuid'];

  @Input() @HostBinding('class.mod-filled') public filled: boolean = false;

  public post$: Observable<PostWithLike>;

  public readonly likeWeight: typeof LikeWeight = LikeWeight;

  public isDisabled: boolean = true;

  private hubLikesService: HubLikesService;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private nativeHubLikesService: HubLikesService,
    @SkipSelf() @Optional() private customHubLikesService: HubLikesService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register(svgLike);

    this.hubLikesService = this.customHubLikesService || this.nativeHubLikesService;
  }

  public ngOnInit(): void {
    fromEvent(this.elementRef.nativeElement, 'click').pipe(
      untilDestroyed(this),
    ).subscribe((event) => event.stopPropagation());

    this.post$ = this.hubLikesService.getPostChanges(this.postId);

    this.hubLikesService.canLikePost(this.postId).pipe(
      map((canLike) => !canLike),
      untilDestroyed(this),
    ).subscribe((isDisabled) => {
      this.isDisabled = isDisabled;
      this.changeDetectorRef.markForCheck();
    });
  }

  public onLike(post: PostWithLike): void {
    if (!this.isDisabled) {
      this.changeLikeWeight(post, LikeWeight.Up);
    }
  }

  public onDislike(post: PostWithLike): void {
    if (!this.isDisabled) {
      this.changeLikeWeight(post, LikeWeight.Down);
    }
  }

  private changeLikeWeight(post: PostWithLike, newLikeWeight: LikeWeight): void {
    // this subscription has no unsubscribe logic
    // to ensure the post was updated after some dialog (for ex) closed
    this.hubLikesService.likePost(
      this.postId,
      post.likeWeight === newLikeWeight
        ? LikeWeight.Zero
        : newLikeWeight
    ).pipe(
      take(1),
    ).subscribe();
  }
}
