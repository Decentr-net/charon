import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgExpandMore } from '@shared/svg-icons';
import { HUB_HEADER_META_SLOT } from '../../components/hub-header';
import { HubPageService } from './hub-page.service';


@Component({
  selector: 'app-hub-page',
  templateUrl: './hub-page.component.html',
  styleUrls: ['./hub-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    HubPageService,
  ],
})
export class HubPageComponent implements OnInit {
  public headerMetaSlotName = HUB_HEADER_META_SLOT;

  public avatar$: Observable<string>;

  constructor(
    private hubPageService: HubPageService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgExpandMore,
    ]);
  }

  public ngOnInit(): void {
    this.avatar$ = this.hubPageService.getAvatar();
  }
}
