import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

import { NetworkSelectorComponent } from './network-selector.component';

@NgModule({
  declarations: [NetworkSelectorComponent],
  imports: [
    MatMenuModule,
  ],
  exports: [NetworkSelectorComponent],
})
export class NetworkSelectorModule {
}
