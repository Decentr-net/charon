import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-hub-post-content',
  templateUrl: './hub-post-content.component.html',
  styleUrls: ['./hub-post-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class HubPostContentComponent {
  @Input() public content: string;
}
