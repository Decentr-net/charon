import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocationPDV, PDVType } from 'decentr-js';

import { listenLocation } from './events';

export const listenLocationPDVs = (): Observable<LocationPDV> => {
  return listenLocation().pipe(
    map((location) => {
      const url = new URL(location.href);
      const pdvSource = {
        host: url.host,
        path: url.pathname,
      };

      return {
        type: PDVType.Location,
        latitude: location.latitude,
        longitude: location.longitude,
        requestedBy: pdvSource,
        timestamp: new Date().toISOString(),
      };
    }),
  );
};
