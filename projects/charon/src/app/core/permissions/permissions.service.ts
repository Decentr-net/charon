import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Wallet } from 'decentr-js';

import { PermissionsService as BasePermissionsService } from '@shared/permissions';
import { AuthService } from '../auth';
import { UserService } from '../services';
import { UserPermissions } from './permissions';

@UntilDestroy()
@Injectable()
export class PermissionsService extends BasePermissionsService<UserPermissions> {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    super();

    this.initModeratorPermissions();
  }

  private initModeratorPermissions(): void {
    this.authService.getActiveUserAddress().pipe(
      switchMap((walletAddress: Wallet['address']) => {
        return walletAddress
          ? this.userService.getModeratorAddresses().pipe(
            map((moderatorAddresses) => moderatorAddresses.includes(walletAddress)),
          )
          : of(false);
      }),
      untilDestroyed(this),
    ).subscribe((isModerator) => {
      if (isModerator) {
        this.addPermissions(UserPermissions.DELETE_POST);
      } else {
        this.removePermissions(UserPermissions.DELETE_POST);
      }
    });
  }
}
