import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TokenBalanceHistory } from 'decentr-js';

import { PDVService } from '@shared/services/pdv';

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
    @Inject(MAT_DIALOG_DATA) public coinRateValue: number,
  ) {
  }

  public ngOnInit(): void {
    this.rewardsHistory$ = this.pdvService.getTokenBalanceHistory();
  }
}
