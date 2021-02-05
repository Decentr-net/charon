import { AuthBrowserStorageService, User } from '../../../../../shared/services/auth';
import { EMPTY, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const authStorage = new AuthBrowserStorageService();

export const whileUserActive = <T>(observableFactory: (user: User) => Observable<T>) => {
  return authStorage.getActiveUser().pipe(
    switchMap((user) => user && user.registrationCompleted ? observableFactory(user) : EMPTY),
  );
};
