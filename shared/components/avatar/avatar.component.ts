import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { svgUserAvatar1, svgUserAvatar2, svgUserAvatar3, svgUserAvatar4, svgUserAvatar5 } from '../../svg-icons';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input() public icon: string;

  constructor(
    private svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgUserAvatar1,
      svgUserAvatar2,
      svgUserAvatar3,
      svgUserAvatar4,
      svgUserAvatar5,
    ]);
  }
}
