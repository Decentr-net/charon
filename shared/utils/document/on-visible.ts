import { fromEvent, Observable, partition } from 'rxjs';
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

export const whileDocumentVisible = <T>(stream: Observable<T>): Observable<T> => {
  const { visible$, invisible$ } = documentVisibility();

  return stream.pipe(
    takeUntil(invisible$),
    repeatWhen(() => visible$),
  );
}
