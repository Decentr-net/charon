import { Injectable, NgModule } from '@angular/core';

import { ConfigService } from './config.service';
import { Environment } from '../../../environments/environment.definitions';
import { NetworkBrowserStorageService } from '../network-storage';

@Injectable()
class ConfigServiceInjectable extends ConfigService {
  constructor(
    environment: Environment,
    networkBrowserStorageService: NetworkBrowserStorageService,
  ) {
    super(environment, networkBrowserStorageService);
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
