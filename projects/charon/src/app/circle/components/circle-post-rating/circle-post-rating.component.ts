import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-post-rating',
  templateUrl: './circle-post-rating.component.html',
  styleUrls: ['./circle-post-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePostRatingComponent {
  @Input() public likes: number;
  @Input() public dislikes: number;
}
