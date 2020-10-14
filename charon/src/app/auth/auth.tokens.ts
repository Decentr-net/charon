import { InjectionToken } from '@angular/core';

export const UNAUTHORIZED_REDIRECT_URL: InjectionToken<string>
  = new InjectionToken('UNAUTHORIZED_REDIRECT_URL');
export const UNCONFIRMED_EMAIL_REDIRECT_URL: InjectionToken<string>
  = new InjectionToken('UNCONFIRMED_EMAIL_REDIRECT_URL');
