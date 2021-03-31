import { fromEvent, Observable, OperatorFunction, partition, pipe } from 'rxjs';
import { mapTo, repeatWhen, takeUntil } from 'rxjs/operators';

export const documentVisibility = (): { visible$: Observable<void>, invisible$: Observable<void> } => {
  const [visible$, invisible$] = partition(
    fromEvent(document, 'visibilitychange').pipe(
      mapTo(void 0),
    ),
    () => document.visibilityState === 'visible',
  );

  return { visible$, invisible$ };
}

export const whileDocumentVisible = <T>(): OperatorFunction<T, T> => {
  const { visible$, invisible$ } = documentVisibility();

  return pipe(
    takeUntil(invisible$),
    repeatWhen(() => visible$),
  );
}
