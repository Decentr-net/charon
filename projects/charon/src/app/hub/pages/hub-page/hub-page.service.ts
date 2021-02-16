import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { AuthService, AuthUser } from '@core/auth';

@Injectable()
export class HubPageService {
  constructor(
    private authService: AuthService,
  ) {
  }

  public getAvatar(): Observable<AuthUser['avatar']> {
    return this.authService.getActiveUser().pipe(
      pluck('avatar'),
    );
  }
}
