import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface CirclePostPreview {
  content: string;
  imageSrc: string;
  time: number;
  title: string;
}

@Component({
  selector: 'app-circle-post-preview-card',
  templateUrl: './circle-post-preview-card.component.html',
  styleUrls: ['./circle-post-preview-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePostPreviewCardComponent {
  @Input() public post: CirclePostPreview;

  @Input() public maxContentLines: number;
}
