import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
export class ExpansionListColumnComponent<T> implements OnInit {
  @Input() public columnDef: ExpansionListColumnDefDirective<T>;

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

  public get parentActiveItem(): undefined | Observable<any | undefined> {
    return this.columnDef.parentColumnDef?.getActiveItem();
  }

  public ngOnInit(): void {
    this.items$ = this.columnDef.getItems();

    this.columnDef.getActiveItem().pipe(
      untilDestroyed(this),
    ).subscribe((item) => {
      this.activeItem = item;
      this.changeDetectorRef.markForCheck();
    });

    this.isLoading$ = combineLatest([
      coerceObservable(this.parentActiveItem),
      this.items$,
    ]).pipe(
      map(([parentActiveItem, items]) => (parentActiveItem || !this.columnDef.parentColumnDef) && !items),
    )
  }

  public activateItem(item: T): void {
    if (this.isLastColumn && item === this.activeItem) {
      return;
    }

    this.columnDef.activateItem(item);
  }
}
