import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatchMediaService } from '../../services/match-media/match-media.service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHeaderComponent {

  @Input() background: 'grey' | 'white';
  @Input() selectNetwork: boolean;
  @Input() userProfile: boolean;

  constructor(public matchMediaService: MatchMediaService) {
  }
}
