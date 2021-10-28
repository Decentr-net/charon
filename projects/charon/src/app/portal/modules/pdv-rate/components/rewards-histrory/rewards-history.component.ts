import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TokenBalanceHistory } from 'decentr-js';

import { PDVService } from '@shared/services/pdv';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rewards-history',
  templateUrl: './rewards-history.component.html',
  styleUrls: ['./rewards-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardsHistoryComponent implements OnInit {
  public rewardsHistory$: Observable<TokenBalanceHistory[]>;

  constructor(
    private pdvService: PDVService,
  ) {
  }

  public ngOnInit(): void {
    this.rewardsHistory$ = this.pdvService.getTokenBalanceHistory();
  }
}
