import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { HUB_HEADER_CONTENT_SLOT, HUB_HEADER_META_SLOT } from '../../components/hub-header';
import { HubPageService } from './hub-page.service';
import { Observable } from 'rxjs';

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
  public headerContentSlotName = HUB_HEADER_CONTENT_SLOT;

  public avatar: string = 'user-avatar-1';

  public coinRate$: Observable<number>;
  public balance$: Observable<string>;

  constructor(
    private hubPageService: HubPageService,
  ) {
  }

  public ngOnInit(): void {
    this.coinRate$ = this.hubPageService.getCoinRate();

    this.balance$ = this.hubPageService.getBalance();
  }
}
