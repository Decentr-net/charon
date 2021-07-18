import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  QueryList,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ExpansionListColumnDefDirective } from '../expansion-list-column';
import { ExpansionListService } from './expansion-list.service';

@UntilDestroy()
@Component({
  selector: 'app-expansion-list',
  styleUrls: ['expansion-list.component.scss'],
  templateUrl: './expansion-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ExpansionListService,
  ],
})
export class ExpansionListComponent<T> implements AfterViewInit {
  @Input() public set data(value: T[]) {
    this.expansionListService.setData(value);
  }

  @HostBinding('class.mod-single-column')
  @Input()
  public singleColumnMode: boolean;

  @HostBinding('class.mod-bordered')
  @Input() public border: boolean = true;

  @HostBinding('style.gridTemplateColumns')
  public get gridTemplateColumnsStyle(): string {
    return this.singleColumnMode
      ? ''
      : this.columnsDefs && this.columnsDefs.reduce((style, columnDef) => {
        return style + `minmax(0, ${columnDef.colspan}fr)`;
      }, '');
  }

  @ContentChildren(ExpansionListColumnDefDirective)
  public columnsDefs: QueryList<ExpansionListColumnDefDirective<T | T[keyof T]>>;

  public columnToDisplay: ExpansionListColumnDefDirective<any>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private expansionListService: ExpansionListService<T>,
  ) {
  }

  public ngAfterViewInit(): void {
    this.expansionListService.setActiveColumn(this.columnsDefs.first);

    this.expansionListService.getActiveColumn().pipe(
      untilDestroyed(this),
    ).subscribe((column) => {
      this.columnToDisplay = column;
      this.changeDetectorRef.markForCheck()
    });
  }
}
