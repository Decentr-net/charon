import { InjectionToken } from '@angular/core';

export const UNAUTHORIZED_REDIRECT_URL: InjectionToken<string>
  = new InjectionToken('UNAUTHORIZED_REDIRECT_URL');

export const AUTHORIZED_REDIRECT_URL: InjectionToken<string>
  = new InjectionToken('AUTHORIZED_REDIRECT_URL');

export const UNCONFIRMED_EMAIL_REDIRECT_URL: InjectionToken<string>
  = new InjectionToken('UNCONFIRMED_EMAIL_REDIRECT_URL');

export const CONFIRMED_EMAIL_REDIRECT_URL: InjectionToken<string>
  = new InjectionToken('CONFIRMED_EMAIL_REDIRECT_URL');
