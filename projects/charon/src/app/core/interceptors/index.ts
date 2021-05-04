import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClassProvider } from '@angular/core';

import { MaintenanceInterceptor } from './maintenance.interceptor';
import { OfflineInterceptor } from './offline.interceptor';

export * from './maintenance.interceptor';
export * from './offline.interceptor';

export const INTERCEPTORS_PROVIDERS: ClassProvider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: OfflineInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: MaintenanceInterceptor,
    multi: true,
  },
];
