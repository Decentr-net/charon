import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-hub-post-dialog-content',
  templateUrl: './hub-post-dialog-content.component.html',
  styleUrls: ['./hub-post-dialog-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class HubPostDialogContentComponent {
  @Input() public content: string;
}
