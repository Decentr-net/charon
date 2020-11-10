import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const LOCK_DELAY: InjectionToken<number> = new InjectionToken('LOCK_DELAY');

export const LOCK_INTERACTION_SOURCE: InjectionToken<Observable<void>>
  = new InjectionToken('LOCK_INTERACTION_SOURCE');

export const LOCK_REDIRECT_URL: InjectionToken<number> = new InjectionToken('LOCK_REDIRECT_URL');
