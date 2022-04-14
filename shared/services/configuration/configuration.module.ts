import { Injectable, NgModule } from '@angular/core';

import { ConfigSource } from './config.definitions';
import { ConfigService } from './config.service';
import { NetworkBrowserStorageService } from '../network-storage';

@Injectable()
class ConfigServiceInjectable extends ConfigService {
  constructor(
    configSource: ConfigSource,
    networkBrowserStorageService: NetworkBrowserStorageService,
  ) {
    super(configSource, networkBrowserStorageService);
  }
}

@NgModule({
  providers: [
    {
      provide: ConfigService,
      useClass: ConfigServiceInjectable,
    },
  ],
})
export class ConfigurationModule {
}
