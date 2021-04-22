import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class ExpansionListService<T> {
  private data: ReplaySubject<T[]> = new ReplaySubject(1);

  public getData(): Observable<T[]> {
    return this.data;
  }

  public setData(data: T[]): void {
    this.data.next(data);
  }
}
