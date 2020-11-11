import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@ngneat/transloco';

import { NetworkSelectorComponent } from './network-selector';
import { NetworkSelectorService } from './network-selector.service';

@NgModule({
  declarations: [
    NetworkSelectorComponent,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    TranslocoModule,
  ],
  exports: [
    NetworkSelectorComponent,
  ],
  providers: [
    NetworkSelectorService,
  ],
})
export class NetworkSelectorModule {
}
