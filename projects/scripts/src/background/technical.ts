import { combineLatest, partition, pipe } from 'rxjs';
import { map, repeatWhen, takeUntil } from 'rxjs/operators';

import * as packageSettings from '../../../../package.json';
import { compareSemver } from '../../../../shared/utils/number';
import CONFIG_SERVICE from './config';

const versionSupported$ = CONFIG_SERVICE.getAppMinVersionRequired().pipe(
  map((minVersion) => compareSemver(packageSettings.version, minVersion) >= 0),
);

const maintenanceStatus$ = CONFIG_SERVICE.getMaintenanceStatus();

const [availableToRun$, unavailableToRun$] = partition(
  combineLatest([
    versionSupported$,
    maintenanceStatus$,
  ]).pipe(
    map(([versionSupported, maintenanceStatus$]) => versionSupported && !maintenanceStatus$),
  ),
  Boolean,
);

export const whileApplicationAvailable = () => pipe(
  takeUntil(unavailableToRun$),
  repeatWhen(() => availableToRun$),
);
