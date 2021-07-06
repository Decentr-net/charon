import { EMPTY, from, Observable } from 'rxjs';
import { mergeMap, pluck, startWith, switchMap } from 'rxjs/operators';

const requestLocationPermission = (): Promise<PermissionStatus> => {
  return navigator.permissions.query({ name: 'geolocation' });
};

const watchPermissionStatusChange = (permissionStatus: PermissionStatus): Observable<PermissionStatus> => {
  return new Observable((subscriber) => {
    const listener = function() {
      subscriber.next(this);
    };

    permissionStatus.addEventListener('change', listener);

    return () => permissionStatus.removeEventListener('change', listener);
  });
};

const listenLocationPermissionState = (): Observable<PermissionState> => {
  return from(requestLocationPermission()).pipe(
    mergeMap((status) => watchPermissionStatusChange(status).pipe(
      startWith(status),
      pluck('state'),
    )),
  );
};

const watchPosition = (): Observable<Position> => {
  return new Observable<Position>((subscriber) => {
    const watchId = navigator.geolocation.watchPosition((position) => subscriber.next(position));

    return () => navigator.geolocation.clearWatch(watchId);
  });
};

export const watchPositionOnAllowedSites = (): Observable<Position> => {
  return listenLocationPermissionState().pipe(
    switchMap((state) => state === 'granted' ? watchPosition() : EMPTY)
  );
};