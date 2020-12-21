import { Observable } from 'rxjs';

interface Dimensions {
  height: string;
  width: string;
}

export const observeResize = (element: HTMLElement): Observable<Dimensions> => {
  return new Observable<Dimensions>((subscriber) => {
    const resizeObserver = new ResizeObserver(() => {
      return subscriber.next(({
        height: getComputedStyle(element).height,
        width: getComputedStyle(element).width,
      }))
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  });
};
