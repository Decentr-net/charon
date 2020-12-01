import { NEVER, Observable, timer } from 'rxjs';
import { filter, map, mapTo, startWith, switchMap } from 'rxjs/operators';

export const createSecondsTimer = (
  secondsPeriod: number,
  initialSeconds: number = secondsPeriod,
  resetSource: Observable<void> = NEVER,
): Observable<number> => {
  const tickPeriod = 1000;

  return resetSource.pipe(
    mapTo(secondsPeriod),
    startWith(initialSeconds),
    switchMap((seconds) => timer(0, tickPeriod).pipe(
      map((secondsLast) => seconds - secondsLast),
    )),
    filter((value) => value >= 0),
  );
};
