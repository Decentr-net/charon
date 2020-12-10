import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HUB_HEADER_META_SLOT } from '../../components/hub-header';
import { ColorValueDynamic } from '@shared/components/color-value-dynamic';
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
  public balance$: Observable<ColorValueDynamic>;
  public coinRate$: Observable<ColorValueDynamic>;

  constructor(
    private hubPageService: HubPageService,
  ) {
  }

  public ngOnInit(): void {
    this.avatar$ = this.hubPageService.getAvatar();
    this.balance$ = this.hubPageService.getBalance();
    this.coinRate$ = this.hubPageService.getCoinRateWithMargin();
  }
}
