import { fromEvent, merge, Observable, of, partition } from 'rxjs';
import { mapTo, repeatWhen, takeUntil } from 'rxjs/operators';

export const whileOnline = <T>(source$: Observable<T>): Observable<T> => {
  const [online$, offline$] = partition(
    merge(
      fromEvent(window, 'online').pipe(
        mapTo(true),
      ),
      fromEvent(window, 'offline').pipe(
        mapTo(false),
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
