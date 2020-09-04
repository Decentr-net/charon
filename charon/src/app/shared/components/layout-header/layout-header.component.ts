import { Component, Input } from '@angular/core';
import { MatchMediaService } from '../../services/match-media/match-media.service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss']
})
export class LayoutHeaderComponent {

  @Input() background: string;
  @Input() selectNetwork: boolean;

  constructor(public matchMediaService: MatchMediaService) {
  }
}
