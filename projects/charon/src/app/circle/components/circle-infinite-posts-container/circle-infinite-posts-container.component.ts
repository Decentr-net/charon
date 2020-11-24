import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-circle-infinite-posts-container',
  templateUrl: './circle-infinite-posts-container.component.html',
  styleUrls: ['./circle-infinite-posts-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleInfinitePostsContainerComponent {
  @Input() public isLoading: boolean = false;
  @Output() public readonly loadMore: EventEmitter<void> = new EventEmitter();

  public onLoadMoreClick(): void {
    this.loadMore.emit();
  }
}
