import { partition, pipe } from 'rxjs';
import { repeatWhen, takeUntil } from 'rxjs/operators';


import { compareSemver } from '../../../../shared/utils/number';
import { APP_VERSION } from '../../../../shared/utils/version';
import CONFIG_SERVICE from './config';

export const whileVersionSupported = () => {
  const [versionSupported$, versionUnsupported$] = partition(
    CONFIG_SERVICE.getAppMinVersionRequired(),
    (minVersion) => compareSemver(APP_VERSION, minVersion) >= 0,
  );

  return pipe(
    takeUntil(versionUnsupported$),
    repeatWhen(() => versionSupported$),
  );
};

export const whileServersAvailable = () => {
  const [serversAvailable$, serversUnavailable$] = partition(
    CONFIG_SERVICE.getMaintenanceStatus(),
    (maintenance) => !maintenance,
  );

  return pipe(
    takeUntil(serversUnavailable$),
    repeatWhen(() => serversAvailable$),
  );
};
