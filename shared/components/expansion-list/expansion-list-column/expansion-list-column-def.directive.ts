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
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
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

  @Input('appExpansionListColumnDefColspan') public colspan: number = 1;

  @Input('appExpansionListColumnDefTrackBy') public trackBy: TrackByFunction<T>;

  @ContentChild(ExpansionListCellDefDirective)
  public cellDef: ExpansionListCellDefDirective<T>;

  @ContentChild(ExpansionListHeaderCellDefDirective)
  public headerCellDef: ExpansionListHeaderCellDefDirective<T>;

  @ContentChild(ExpansionListColumnDefDirective)
  public childColumnDef: ExpansionListColumnDefDirective<T[keyof T]>;

  public columnFooterTemplate: TemplateRef<void>;

  public loadingTemplate: TemplateRef<{ $implicit: any }>;

  private activeItem: ReplaySubject<T | undefined> = new ReplaySubject(1);

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
    ).subscribe(() => this.activeItem.next(undefined));
  }

  public activateItem(item: T): void {
    this.activeItem.next(item);
  }

  public getActiveItem(): Observable<T> {
    return this.activeItem.asObservable();
  }

  public getItems(): Observable<T[] | undefined> {
    return this.items.asObservable();
  }

  public isLastColumn(): boolean {
    return !this.childColumnDef;
  }

  public registerFooterTemplate(template: TemplateRef<void>): void {
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
      tap(() => this.items.next(undefined)),
      switchMap((item) => item ? coerceObservable(this.pluck ? item[this.pluck] : item) : []),
      map((items) => coerceArray(items)),
      untilDestroyed(this),
    ).subscribe(this.items);
  }
}
