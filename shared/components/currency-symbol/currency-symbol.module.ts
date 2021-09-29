import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetworkBrowserStorageService } from '../../services/network-storage';
import { CurrencySymbolComponent } from './currency-symbol.component';

@NgModule({
  declarations: [
    CurrencySymbolComponent,
  ],
  exports: [
    CurrencySymbolComponent,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    {
      provide: NetworkBrowserStorageService,
      useClass: NetworkBrowserStorageService,
    },
  ],
})
export class CurrencySymbolModule {
}
