import { fromEvent, merge, Observable, partition } from 'rxjs';
import { map, repeat, takeUntil } from 'rxjs/operators';

export const whileOnline = <T>(source$: Observable<T>): Observable<T> => {
  const [online$, offline$] = partition(
    merge(
      fromEvent(window, 'online').pipe(
        map(() => true),
      ),
      fromEvent(window, 'offline').pipe(
        map(() => false),
      ),
    ),
    Boolean,
  );

  return source$.pipe(
    takeUntil(offline$),
    repeat({
      delay: () => online$,
    }),
  );
};
