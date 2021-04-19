import { isObservable, Observable, of } from 'rxjs';

export const coerceObservable = <T>(source: T | Observable<T>): Observable<T> => {
  return isObservable(source) ? source : of(source);
};
