import { NgModule } from '@angular/core';

import { ConfigApiService } from './config-api.service';
import { ConfigService } from './config.service';

@NgModule({
  providers: [
    ConfigApiService,
    ConfigService,
  ],
})
export class ConfigurationModule {
}
