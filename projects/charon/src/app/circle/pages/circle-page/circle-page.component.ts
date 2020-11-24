import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { CIRCLE_HEADER_CONTENT_SLOT, CIRCLE_HEADER_META_SLOT } from '../../components/circle-header';
import { CirclePageService } from './circle-page.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-circle-page',
  templateUrl: './circle-page.component.html',
  styleUrls: ['./circle-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CirclePageService,
  ],
})
export class CirclePageComponent implements OnInit {
  public headerMetaSlotName = CIRCLE_HEADER_META_SLOT;
  public headerContentSlotName = CIRCLE_HEADER_CONTENT_SLOT;

  public avatar: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Square_-_black_simple.svg/1200px-Square_-_black_simple.svg.png';

  public coinRate$: Observable<number>;
  public balance$: Observable<string>;

  constructor(
    private circlePageService: CirclePageService,
  ) {
  }

  public ngOnInit(): void {
    this.coinRate$ = this.circlePageService.getCoinRate();

    this.balance$ = this.circlePageService.getBalance();
  }
}
