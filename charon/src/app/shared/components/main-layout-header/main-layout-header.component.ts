import { Component } from '@angular/core';
import { MatchMediaService } from '../../services/match-media/match-media.service';

@Component({
  selector: 'app-main-layout-header',
  templateUrl: './main-layout-header.component.html',
  styleUrls: ['./main-layout-header.component.scss']
})
export class MainLayoutHeaderComponent {

  constructor(public matchMediaService: MatchMediaService) {
  }
}
