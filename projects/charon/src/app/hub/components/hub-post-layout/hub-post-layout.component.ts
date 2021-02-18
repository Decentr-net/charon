import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-hub-post-layout',
  templateUrl: './hub-post-layout.component.html',
  styleUrls: ['./hub-post-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostLayoutComponent {
  @Input() public headerBackgroundImage: string;
}
