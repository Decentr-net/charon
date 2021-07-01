import { ModuleWithProviders, NgModule, Type } from '@angular/core';

import { HasPermissionDirective } from './has-permission';
import { PermissionsService } from './permissions.service';

@NgModule({
  declarations: [
    HasPermissionDirective,
  ],
  exports: [
    HasPermissionDirective,
  ],
})
export class PermissionsModule {
  public static forRoot(customPermissionsService?: Type<PermissionsService>): ModuleWithProviders<PermissionsModule> {
    return {
      ngModule: PermissionsModule,
      providers: [
        customPermissionsService
          ? {
            provide: PermissionsService,
            useClass: customPermissionsService,
          }
          : PermissionsService,
      ],
    };
  }
}
