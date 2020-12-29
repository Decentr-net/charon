import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

import { NetworkSelectorComponent } from './network-selector.component';
import { NetworkSelectorService } from './network-selector.service';
import { SpinnerModule } from '../spinner';

export interface NetworkSelectorModuleConfig {
  service: Type<NetworkSelectorService>;
}

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    SpinnerModule,
  ],
  declarations: [
    NetworkSelectorComponent,
  ],
  exports: [
    NetworkSelectorComponent,
  ],
})
export class NetworkSelectorModule {
  public static forRoot(config: NetworkSelectorModuleConfig): ModuleWithProviders<NetworkSelectorModule> {
    return {
      ngModule: NetworkSelectorModule,
      providers: [
        {
          provide: NetworkSelectorService,
          useClass: config.service,
        },
      ],
    };
  }
}
