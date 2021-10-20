import { ChangeDetectionStrategy, Component, ContentChildren, HostBinding, QueryList } from '@angular/core';

import { DetailsTableCellDefDirective } from './details-table-cell-def.directive';
import { isOpenedInTab } from '../../utils/browser';

@Component({
  selector: 'app-details-table',
  templateUrl: './details-table.component.html',
  styleUrls: ['./details-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsTableComponent {
  @HostBinding('class.mod-tab-view')
  public isTabView = isOpenedInTab();

  @ContentChildren(DetailsTableCellDefDirective)
  public cells: QueryList<DetailsTableCellDefDirective>;
}
