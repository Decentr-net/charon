import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface HubPostPreview {
  content: string;
  imageSrc: string;
  time: number;
  title: string;
}

@Component({
  selector: 'app-hub-post-preview-card',
  templateUrl: './hub-post-preview-card.component.html',
  styleUrls: ['./hub-post-preview-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostPreviewCardComponent {
  @Input() public post: HubPostPreview;

  @Input() public maxContentLines: number;
}
