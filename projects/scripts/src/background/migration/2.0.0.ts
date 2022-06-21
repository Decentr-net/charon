import { firstValueFrom } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ProfileUpdate } from 'decentr-js';

import { AuthBrowserStorageService, User } from '../../../../../shared/services/auth';
import { BrowserLocalStorage } from '../../../../../shared/services/storage';
import { PDV_STORAGE_SERVICE } from '../pdv/storage';

interface OldUser extends User, ProfileUpdate {
  emailConfirmed: boolean;
  isModerator: boolean;
  primaryUsername: string;
  registrationCompleted: boolean;
  usernames: string[];
}

const clearPDVStorage = (): Promise<void> => {
  return PDV_STORAGE_SERVICE.clear();
};

const clearToolbarStorage = (): Promise<void> => {
  return BrowserLocalStorage.getInstance().useSection('toolbar').clear();
};

const clearProfilesData = (): Promise<void> => {
  const authStorageService = new AuthBrowserStorageService<OldUser>();

  return firstValueFrom(authStorageService.getUsers().pipe(
    map((users) => {
      users.forEach((user) => {
        delete user.avatar;
        delete user.bio;
        delete user.birthday;
        delete user.emails;
        delete user.firstName;
        delete user.gender;
        delete user.lastName;
        delete user.primaryUsername;
        delete user.usernames;

        delete user.emailConfirmed;
        delete user.isModerator;
        delete user.registrationCompleted;
      });

      return users;
    }),
    mergeMap((users) => authStorageService.setUsers(users)),
  ));
};

export const migrate = async (): Promise<void> => {
  await clearPDVStorage();

  await clearToolbarStorage();

  await clearProfilesData();
};
