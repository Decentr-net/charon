import { InjectionToken } from '@angular/core';

export const LOCK_DELAY: InjectionToken<number> = new InjectionToken('LOCK_DELAY');
export const LOCKED_REDIRECT_URL: InjectionToken<number> = new InjectionToken('LOCKED_REDIRECT_URL');
export const UNAUTHORIZED_REDIRECT_URL: InjectionToken<string>
  = new InjectionToken('UNAUTHORIZED_REDIRECT_URL');
export const UNCONFIRMED_EMAIL_REDIRECT_URL: InjectionToken<string>
  = new InjectionToken('UNCONFIRMED_EMAIL_REDIRECT_URL');
