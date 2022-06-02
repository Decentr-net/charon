import { NgModule } from '@angular/core';

import { SentinelService } from './sentinel.service';
import { SentinelApiService } from './sentinel-api.service';

@NgModule({
  providers: [
    SentinelService,
    SentinelApiService,
  ],
})
export class SentinelModule {
}
