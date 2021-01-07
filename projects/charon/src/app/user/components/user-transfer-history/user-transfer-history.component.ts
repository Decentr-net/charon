import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TransferHistoryTransaction } from 'decentr-js';

import { InfiniteLoadingPresenter } from '@shared/utils/infinite-loading';
import { UserTransferHistoryService } from './user-transfer-history.service';

@Component({
  selector: 'app-user-transfer-history',
  templateUrl: './user-transfer-history.component.html',
  styleUrls: ['./user-transfer-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UserTransferHistoryService,
  ],
})
export class UserTransferHistoryComponent
  extends InfiniteLoadingPresenter<TransferHistoryTransaction>
  implements OnInit
{
  constructor(private userTransferHistoryService: UserTransferHistoryService) {
    super(userTransferHistoryService);
  }

  public ngOnInit(): void {
    this.userTransferHistoryService.loadMoreItems();
  }
}
