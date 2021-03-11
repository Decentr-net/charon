import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { SpinnerModule } from '../spinner';
import { TypefaceModule } from '../../directives/typeface';
import { NetworkSelectorComponent } from './network-selector.component';
import { NetworkSelectorService } from './network-selector.service';

export interface NetworkSelectorModuleConfig {
  service: Type<NetworkSelectorService>;
}

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    SpinnerModule,
    SvgIconsModule,
    TypefaceModule,
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
