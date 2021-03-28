import { NgModule } from '@angular/core';

import { MicroValueModule } from '../../pipes/micro-value';
import { ConfigurationModule } from '../configuration';
import { PDVApiService } from './pdv-api.service';
import { PDVService } from './pdv-service';
import { PDVStorageService } from './pdv-storage.service';
import { AuthBrowserStorageService } from '../auth';
import { NetworkBrowserStorageService } from '../network-storage';

@NgModule({
  imports: [
    ConfigurationModule,
    MicroValueModule,
  ],
  providers: [
    AuthBrowserStorageService,
    NetworkBrowserStorageService,

    PDVApiService,
    PDVService,
    PDVStorageService,
  ],
})
export class PDVModule {
}
