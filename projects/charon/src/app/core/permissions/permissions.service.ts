import { Injectable } from '@angular/core';
import { distinctUntilChanged, map, pluck, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Wallet } from 'decentr-js';

import { PermissionsService as BasePermissionsService } from '@shared/permissions';
import { AuthService } from '../auth';
import { UserService } from '../services';
import { UserPermissions } from './permissions';
import { of } from 'rxjs';

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
    this.authService.getActiveUser().pipe(
      pluck('wallet', 'address'),
      distinctUntilChanged(),
      switchMap((walletAddress: Wallet['address']) => {
        return walletAddress
          ? this.userService.getModeratorAddresses().pipe(
            map((moderatorAddresses) => moderatorAddresses.includes(walletAddress)),
          )
          : of(false)
      }),
      untilDestroyed(this),
    ).subscribe((isModerator) => {
      isModerator
        ? this.addPermissions(UserPermissions.DELETE_POST)
        : this.removePermissions(UserPermissions.DELETE_POST);
    });
  }
}
