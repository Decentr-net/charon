import { fromEvent, merge, Observable, of, partition } from 'rxjs';
import { map, repeatWhen, takeUntil } from 'rxjs/operators';

export const whileOnline = <T>(source$: Observable<T>): Observable<T> => {
  const [online$, offline$] = partition(
    merge(
      fromEvent(window, 'online').pipe(
        map(() => true),
      ),
      fromEvent(window, 'offline').pipe(
        map(() => false),
      ),
      of(navigator.onLine),
    ),
    Boolean,
  );

  return source$.pipe(
    takeUntil(offline$),
    repeatWhen(() => online$),
  );
};
