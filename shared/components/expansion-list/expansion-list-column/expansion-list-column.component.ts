import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, startWith, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { coerceObservable } from '../../../utils/observable';
import { ExpansionListColumnDefDirective } from './expansion-list-column-def.directive';

@UntilDestroy()
@Component({
  selector: 'app-expansion-list-column',
  styleUrls: ['./expansion-list-column.component.scss'],
  templateUrl: './expansion-list-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionListColumnComponent<T> implements OnInit, AfterViewInit {
  @Input() public columnDef: ExpansionListColumnDefDirective<T>;

  @ViewChildren('cell') public cells: QueryList<ElementRef<HTMLDivElement>>;

  @HostBinding('class.mod-last')
  public get isLastColumn(): boolean {
    return this.columnDef.isLastColumn();
  }

  public items$: Observable<T[]>;

  public isLoading$: Observable<boolean>;

  public activeItem: T;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngAfterViewInit(): void {
    if (!this.columnDef.chooseFirst) {
      return;
    }

    this.cells.changes.pipe(
      startWith(this.cells),
      map((cellsQueryList: QueryList<ElementRef<HTMLDivElement>>) => cellsQueryList.toArray()),
      filter((cellRefs) => cellRefs.length > 0),
      map((cellRefs) => cellRefs[0].nativeElement),
      take(1),
      untilDestroyed(this),
    ).subscribe((firstCell) => {
      firstCell.click();
    });
  }

  public get parentActiveItem(): undefined | Observable<any | undefined> {
    return this.columnDef.parentColumnDef?.getActiveItem();
  }

  public ngOnInit(): void {
    this.items$ = this.columnDef.getItems();

    this.columnDef.getActiveItem().pipe(
      untilDestroyed(this),
    ).subscribe((item) => {
      this.activeItem = item;
      this.changeDetectorRef.detectChanges();
    });

    this.isLoading$ = combineLatest([
      coerceObservable(this.parentActiveItem),
      this.items$,
    ]).pipe(
      map(([parentActiveItem, items]) => (parentActiveItem || !this.columnDef.parentColumnDef) && !items),
    )
  }

  public activateItem(item: T): void {
    if (this.isLastColumn || item === this.activeItem) {
      return;
    }

    this.columnDef.activateItem(item);
  }
}
