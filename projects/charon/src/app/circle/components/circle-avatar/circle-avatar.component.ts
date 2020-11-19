import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-avatar',
  templateUrl: './circle-avatar.component.html',
  styleUrls: ['./circle-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleAvatarComponent {
  @Input() public src: string;
}
