import {
  ContentChild,
  Directive,
  Input,
  OnInit,
  Optional,
  SkipSelf,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';
import { coerceArray } from '@angular/cdk/coercion';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { coerceObservable } from '../../../utils/observable';
import { ExpansionListService } from '../expansion-list/expansion-list.service';
import { ExpansionListCellDefDirective } from '../expansion-list-cell';
import { ExpansionListHeaderCellDefDirective } from '../expansion-list-header-cell';

@UntilDestroy()
@Directive({
  selector: '[appExpansionListColumnDef]',
})
export class ExpansionListColumnDefDirective<T> implements OnInit {
  @Input('appExpansionListColumnDef') public pluck: string;

  @Input('appExpansionListColumnDefChooseFirst') public chooseFirst: boolean = true;

  @Input('appExpansionListColumnDefColspan') public colspan: number = 1;

  @Input('appExpansionListColumnDefTrackBy') public trackBy: TrackByFunction<T>;

  @ContentChild(ExpansionListCellDefDirective)
  public cellDef: ExpansionListCellDefDirective<T>;

  @ContentChild(ExpansionListHeaderCellDefDirective)
  public headerCellDef: ExpansionListHeaderCellDefDirective<T>;

  @ContentChild(ExpansionListColumnDefDirective)
  public childColumnDef: ExpansionListColumnDefDirective<T[keyof T]>;

  public columnFooterTemplate: TemplateRef<{ $implicit: T[] }>;

  public loadingTemplate: TemplateRef<{ $implicit: any }>;

  private activeItem: BehaviorSubject<T | undefined> = new BehaviorSubject(undefined);

  private items: BehaviorSubject<T[]> = new BehaviorSubject(undefined);

  constructor(
    private expansionListService: ExpansionListService<T | T[keyof T]>,
    @Optional() @SkipSelf() public parentColumnDef: ExpansionListColumnDefDirective<T>,
  ) {
  }

  public ngOnInit(): void {
    this.initItemsSource();

    this.loadingTemplate = this.parentColumnDef?.loadingTemplate;

    this.items.pipe(
      untilDestroyed(this),
    ).subscribe((items) => {
      if (!this.activeItem.value || !this.trackBy) {
        return this.activeItem.next(undefined);
      }

      const itemIds = items.map((item, index) => this.trackBy(index, item));
      const activeItemId = this.trackBy(-1, this.activeItem.value);
      if (itemIds.includes(activeItemId)) {
        return;
      }
    });
  }

  public activateItem(item: T): void {
    this.activeItem.next(item);
  }

  public getActiveItem(): Observable<T> {
    return this.activeItem.pipe(
      distinctUntilChanged(),
    );
  }

  public getParentActiveItem(): Observable<any | undefined> {
    return this.parentColumnDef?.getActiveItem() || of(undefined);
  }

  public getItems(): Observable<T[] | undefined> {
    return this.items.asObservable();
  }

  public get isFirstColumn(): boolean {
    return !this.parentColumnDef;
  }

  public get isLastColumn(): boolean {
    return !this.childColumnDef;
  }

  public registerFooterTemplate(template: TemplateRef<{ $implicit: T[] }>): void {
    this.columnFooterTemplate = template;
  }

  public registerLoadingTemplate(template: TemplateRef<{ $implicit: any }>): void {
    this.loadingTemplate = template;
  }

  private initItemsSource(): void {
    if (!this.parentColumnDef) {
      this.expansionListService.getData().pipe(
        untilDestroyed(this),
      ).subscribe(this.items);

      return;
    }

    this.parentColumnDef.getActiveItem().pipe(
      tap((item) => item && this.expansionListService.setActiveColumn(this)),
      tap(() => this.items.next(undefined)),
      switchMap((item) => item ? coerceObservable(this.pluck ? item[this.pluck] : item) : []),
      map((items) => coerceArray(items)),
      untilDestroyed(this),
    ).subscribe(this.items);
  }
}
