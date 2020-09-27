import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@ngneat/transloco';

import { NetworkSelectorComponent } from './network-selector.component';

@NgModule({
  declarations: [NetworkSelectorComponent],
  imports: [
    MatMenuModule,
    TranslocoModule,
  ],
  exports: [NetworkSelectorComponent],
})
export class NetworkSelectorModule {
}
