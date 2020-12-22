import { ModuleWithProviders, NgModule } from '@angular/core';
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
  public static forRoot(): ModuleWithProviders<PermissionsModule> {
    return {
      ngModule: PermissionsModule,
      providers: [
        PermissionsService,
      ],
    };
  }
}
