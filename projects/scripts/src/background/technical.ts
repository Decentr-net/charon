import { Observable, partition } from 'rxjs';
import { repeat, takeUntil } from 'rxjs/operators';

import { compareSemver } from '../../../../shared/utils/number';
import { APP_VERSION } from '../../../../shared/utils/version';
import CONFIG_SERVICE from './config';

export const whileVersionSupported = <T>(source$: Observable<T>): Observable<T> => {
  const [versionSupported$, versionUnsupported$] = partition(
    CONFIG_SERVICE.getAppMinVersionRequired(true),
    (minVersion) => compareSemver(APP_VERSION, minVersion) >= 0,
  );

  return source$.pipe(
    takeUntil(versionUnsupported$),
    repeat({
      delay: () => versionSupported$,
    }),
  );
};
