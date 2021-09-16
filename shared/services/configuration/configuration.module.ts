import { NgModule } from '@angular/core';

import { NetworkBrowserStorageService } from '../network-storage';
import { ConfigApiService } from './config-api.service';
import { ConfigService } from './config.service';

@NgModule({
  providers: [
    ConfigApiService,
    ConfigService,
    NetworkBrowserStorageService,
  ],
})
export class ConfigurationModule {
}
