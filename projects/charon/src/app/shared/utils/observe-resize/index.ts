import { Observable } from 'rxjs';

export const observeResize = (element: HTMLElement) => new Observable<void>((subscriber) => {
  const resizeObserver = new ResizeObserver(() => subscriber.next());
  resizeObserver.observe(element);

  return () => resizeObserver.disconnect();
});
