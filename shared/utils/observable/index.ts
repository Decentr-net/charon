import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

export const createSharedOneValueObservable = <T>(source: Observable<T>): Observable<T> => {
  let value$: ReplaySubject<T> = new ReplaySubject<T>(1);

  source.pipe(
    take(1),
  ).subscribe((value) => value$.next(value));

  return value$;
}
