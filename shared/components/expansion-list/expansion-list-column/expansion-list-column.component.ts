import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, pluck, switchMapTo, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { coerceObservable } from '../../../utils/observable';
import { ExpansionListColumnDefDirective } from './expansion-list-column-def.directive';
import { ExpansionListService } from '../expansion-list/expansion-list.service';

@UntilDestroy()
@Component({
  selector: 'app-expansion-list-column',
  styleUrls: ['./expansion-list-column.component.scss'],
  templateUrl: './expansion-list-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionListColumnComponent<T> implements OnInit {
  @Input() public columnDef: ExpansionListColumnDefDirective<T>;

  @Input() public singleDisplayMode: boolean = false;

  @ViewChild('cellsContainer') public cellsContainer: ElementRef<HTMLDivElement>;

  @HostBinding('class.mod-last')
  public get isLastColumn(): boolean {
    return this.columnDef.isLastColumn;
  }

  public items$: Observable<T[]>;

  public isLoading$: Observable<boolean>;

  public activeItem: T;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private expansionListService: ExpansionListService<any>
  ) {
  }

  public get parentActiveItem(): Observable<any | undefined> {
    return this.columnDef.getParentActiveItem();
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
    );

    const newItemsLoaded$ = this.isLoading$.pipe(
      filter((isLoading) => isLoading),
      switchMapTo(this.items$.pipe(
        filter((items) => !!items),
        take(1),
      )),
    );

    newItemsLoaded$.pipe(
      untilDestroyed(this),
    ).subscribe(() => this.cellsContainer.nativeElement.scrollTop = 0);

    newItemsLoaded$.pipe(
      filter(() => this.columnDef.chooseFirst),
      filter((items) => items?.length > 0),
      pluck(0),
      untilDestroyed(this),
    ).subscribe((item) => this.activateItem(item));

    this.expansionListService.getActiveColumn().pipe(
      filter((columnDef) => columnDef === this.columnDef),
      untilDestroyed(this),
    ).subscribe(() => this.activateItem(undefined));
  }

  public activateItem(item: T): void {
    if (this.isLastColumn || item === this.activeItem) {
      return;
    }

    this.columnDef.activateItem(item);
  }

  public back(): void {
    this.expansionListService.setActiveColumn(this.columnDef.parentColumnDef || this.columnDef);
  }
}
