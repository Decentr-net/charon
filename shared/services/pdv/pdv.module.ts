import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { MicroValueModule } from '../../pipes/micro-value';
import { ConfigurationModule } from '../configuration';
import { PDVApiService } from './pdv-api.service';
import { PDVService } from './pdv.service';
import { PDVStorageService } from './pdv-storage.service';
import { AuthBrowserStorageService } from '../auth';

@NgModule({
  imports: [
    ConfigurationModule,
    MicroValueModule,
  ],
  providers: [
    AuthBrowserStorageService,
    DecimalPipe,
    PDVApiService,
    PDVService,
    PDVStorageService,
  ],
})
export class PDVModule {
}
