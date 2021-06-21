import { map, mergeMap } from 'rxjs/operators';

import { MessageBus } from '../../../../../shared/message-bus';
import { MessageCode } from '../../messages';
import { listenLocationPermissionGranted } from './events';

export interface LocationParams {
  href: string;
  latitude: number;
  longitude: number;
}

const messageBus = new MessageBus<{ [MessageCode.Location]: { body: LocationParams } }>();

const createPositionPromise = (): Promise<Position> => {
  return new Promise<Position>((resolve) => {
    navigator.geolocation.getCurrentPosition(resolve);
  });
}

export const initLocationStream = (): void => {
  listenLocationPermissionGranted().pipe(
    mergeMap(() => createPositionPromise()),
    map((position) => ({
      href: window.location.href,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })),
    mergeMap((location) => messageBus.sendMessage(MessageCode.Location, location)),
  ).subscribe();
};
