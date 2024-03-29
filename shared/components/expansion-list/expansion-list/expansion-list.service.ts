import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { ExpansionListColumnDefDirective } from '../expansion-list-column';

@Injectable()
export class ExpansionListService<T> {
  private readonly data: ReplaySubject<T[]> = new ReplaySubject(1);

  private readonly activeColumn: ReplaySubject<ExpansionListColumnDefDirective<unknown>> = new ReplaySubject();

  public getData(): Observable<T[]> {
    return this.data;
  }

  public setData(data: T[]): void {
    this.data.next(data);
  }

  public getActiveColumn(): Observable<ExpansionListColumnDefDirective<unknown>> {
    return this.activeColumn.pipe(
      distinctUntilChanged(),
    );
  }

  public setActiveColumn(column: ExpansionListColumnDefDirective<unknown>): void {
    this.activeColumn.next(column);
  }
}
