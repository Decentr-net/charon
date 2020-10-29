import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@ngneat/transloco';

import { NetworkSelectorComponent } from './network-selector.component';
import { NetworkSelectorStoreService } from './network-selector-store.service';

export interface NetworkSelectorModuleConfig {
  store: Type<NetworkSelectorStoreService>;
}

@NgModule({
  declarations: [NetworkSelectorComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    TranslocoModule,
  ],
  exports: [NetworkSelectorComponent],
})
export class NetworkSelectorModule {
  public static forRoot(config: NetworkSelectorModuleConfig): ModuleWithProviders {
    return {
      ngModule: NetworkSelectorModule,
      providers: [
        {
          provide: NetworkSelectorStoreService,
          useClass: config.store,
        },
      ],
    };
  }
}
