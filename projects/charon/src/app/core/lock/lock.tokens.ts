import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const LOCK_ACTIVITY_SOURCE: InjectionToken<Observable<void>>
  = new InjectionToken('LOCK_ACTIVITY_SOURCE');

export const LOCK_REDIRECT_URL: InjectionToken<number> = new InjectionToken('LOCK_REDIRECT_URL');
