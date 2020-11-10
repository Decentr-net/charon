import { NEVER, Observable, timer } from 'rxjs';
import { filter, map, mapTo, startWith, switchMap } from 'rxjs/operators';

export const createSecondsTimer = (
  seconds: number,
  initialSeconds: number = seconds,
  resetSource: Observable<void> = NEVER,
): Observable<number> => {
  const period = 1000;
  return resetSource.pipe(
    mapTo(seconds),
    startWith(initialSeconds),
    switchMap((seconds) => timer(0, period).pipe(
      map((tick) => seconds - tick),
    )),
    filter((value) => value >= 0),
  );
}
