import { ChangeDetectionStrategy, Component } from '@angular/core';

import { InfiniteLoadingPresenter } from '@shared/utils/infinite-loading';
import { AssetHistoryItem } from '../assets-history-list-item';
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
export class UserTransferHistoryComponent extends InfiniteLoadingPresenter<AssetHistoryItem> {
  constructor(private userTransferHistoryService: UserTransferHistoryService) {
    super(userTransferHistoryService);
  }
}
