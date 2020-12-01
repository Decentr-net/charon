import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-hub-infinite-posts-container',
  templateUrl: './hub-infinite-posts-container.component.html',
  styleUrls: ['./hub-infinite-posts-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubInfinitePostsContainerComponent {
  @Input() public isLoading: boolean = false;
  @Output() public readonly loadMore: EventEmitter<void> = new EventEmitter();

  public onLoadMoreClick(): void {
    this.loadMore.emit();
  }
}
