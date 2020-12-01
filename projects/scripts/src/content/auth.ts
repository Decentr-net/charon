import { Observable } from 'rxjs';

import { AuthBrowserStorageService } from '../../../../shared/services/auth';
import { map } from 'rxjs/operators';

const authStorage = new AuthBrowserStorageService();

export const isAuthorized$ = (): Observable<boolean> => authStorage.getActiveUser()
  .pipe(
    map(user => user && user.registrationCompleted),
  );
