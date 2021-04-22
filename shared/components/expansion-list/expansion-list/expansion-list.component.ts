import { ChangeDetectionStrategy, Component, ContentChildren, HostBinding, Input, QueryList } from '@angular/core';

import { ExpansionListColumnDefDirective } from '../expansion-list-column';
import { ExpansionListService } from './expansion-list.service';

@Component({
  selector: 'app-expansion-list',
  styleUrls: ['expansion-list.component.scss'],
  templateUrl: './expansion-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ExpansionListService,
  ],
})
export class ExpansionListComponent<T> {
  @Input() public set data(value: T[]) {
    this.expansionListService.setData(value);
  }

  @HostBinding('style.gridTemplateColumns')
  public get gridTemplateColumnsStyle(): string {
    return this.columnsDefs && this.columnsDefs.reduce((style, columnDef) => {
      return style + `minmax(0, ${columnDef.colspan}fr)`;
    }, '');
  }

  @ContentChildren(ExpansionListColumnDefDirective)
  public columnsDefs: QueryList<ExpansionListColumnDefDirective<T | T[keyof T]>>;

  constructor(
    private expansionListService: ExpansionListService<T>,
  ) {
  }
}
