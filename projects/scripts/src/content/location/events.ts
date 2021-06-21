import { from, Observable } from 'rxjs';
import { filter, mapTo, mergeMap, take } from 'rxjs/operators';

const requestLocationPermission = (): Promise<PermissionStatus> => {
  return navigator.permissions.query({ name:'geolocation' });
};

const createPermissionStatusChangeStream = (permissionStatus: PermissionStatus): Observable<PermissionStatus> => {
  return new Observable((subscriber) => {
    const listener = function() {
      subscriber.next(this);
    };

    permissionStatus.addEventListener('change', listener);

    return () => permissionStatus.removeEventListener('change', listener);
  });
};

export const listenLocationPermissionGranted = (): Observable<void> => {
  return from(requestLocationPermission()).pipe(
    filter((status) => status.state === 'prompt'),
    mergeMap((status) => createPermissionStatusChangeStream(status)),
    take(1),
    filter((newStatus) => newStatus.state === 'granted'),
    mapTo(void 0),
  );
};
