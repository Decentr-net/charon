import {
  ChangeDetectionStrategy,
  Component, ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TrackByFunction,
} from '@angular/core';

import { DataTableColumnDefDirective, DataTableEmptyRowDefDirective } from './directives';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T> {
  @Input() public data: T[];
  @Input() public trackBy: TrackByFunction<T>;

  @Input() selectedItems: T[] = [];

  @Output() itemClick: EventEmitter<T> = new EventEmitter();

  @ContentChildren(DataTableColumnDefDirective)
  public dataTableColumnDefs: QueryList<DataTableColumnDefDirective>;

  @ContentChild(DataTableEmptyRowDefDirective)
  public dataTableEmptyRowDef: DataTableEmptyRowDefDirective;

  public get columns(): DataTableColumnDefDirective[] {
    return this.dataTableColumnDefs.toArray();
  }

  public get columnNames(): DataTableColumnDefDirective['idOrName'][] {
    return this.columns.map(({ idOrName }) => idOrName);
  }

  public isItemSelected(item: T): boolean {
    return this.trackBy
      ? this.selectedItems.findIndex((selectedItem, index) => {
        return this.trackBy(index, selectedItem) === this.trackBy(-1, item);
      }) > -1
      : this.selectedItems.includes(item);
  }

  public onItemClick(item: T): void {
    this.itemClick.emit(item);
  }

  public trackByColumnIdOrName: TrackByFunction<DataTableColumnDefDirective> = ({}, { idOrName }) => idOrName;
}
