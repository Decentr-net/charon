import { Observable } from 'rxjs';

export const observeDocumentVisibility = (): Observable<boolean> => {
  return new Observable((subscriber) => {
    const listener = () => {
      const visible = document.visibilityState === 'visible';

      subscriber.next(visible);
    };

    window.addEventListener('visibilitychange', listener);

    return () => window.removeEventListener('visibilitychange', listener);
  });
};
