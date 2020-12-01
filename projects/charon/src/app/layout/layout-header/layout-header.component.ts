import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MediaService } from '@core/services/media';

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

  constructor(public mediaService: MediaService) {
  }
}
