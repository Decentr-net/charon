import { Observable, OperatorFunction } from 'rxjs';
import { delay, map, retryWhen } from 'rxjs/operators';

export const retryTimes = <T>(retriesCount: number, retryDelay: number): OperatorFunction<T, T> => {
  return (source$: Observable<T>) => {
    return source$.pipe(
      retryWhen((errors) => {
        let retries = 0;
        return errors.pipe(
          delay(retryDelay),
          map((error) => {
            if (retries++ === retriesCount + 1) {
              throw error;
            }
            return error;
          }),
        );
      }),
    );
  };
};
