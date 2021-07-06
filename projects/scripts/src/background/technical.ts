import { partition, pipe } from 'rxjs';
import { repeatWhen, takeUntil } from 'rxjs/operators';

import * as packageSettings from '../../../../package.json';
import { compareSemver } from '../../../../shared/utils/number';
import CONFIG_SERVICE from './config';

export const whileVersionSupported = () => {
  const [versionSupported$, versionUnsupported$] = partition(
    CONFIG_SERVICE.getAppMinVersionRequired(),
    (minVersion) => compareSemver(packageSettings.version, minVersion) >= 0,
  );

  return pipe(
    takeUntil(versionUnsupported$),
    repeatWhen(() => versionSupported$),
  );
};

export const whileServersAvailable = () => {
  const [serversAvailable$, serversUnavailable$] = partition(
    CONFIG_SERVICE.getMaintenanceStatus(),
    Boolean
  );

  return pipe(
    takeUntil(serversUnavailable$),
    repeatWhen(() => serversAvailable$),
  );
};
