import { NEVER, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthBrowserStorageService } from '../../../shared/services/auth';

const authStorage = new AuthBrowserStorageService();

export const getActiveUser = () => {
  return authStorage.getActiveUser().pipe(
    switchMap((user) => user ? of(user) : NEVER),
  );
}
