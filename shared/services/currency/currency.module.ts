import { ModuleWithProviders, NgModule } from '@angular/core';
import { CurrencyApiService } from './api';
import { HttpClient } from '@angular/common/http';
import { CurrencyService } from './currency.service';

export interface CurrencyModuleConfig {
  api: string;
}

@NgModule()
export class CurrencyModule {
  public static forRoot(config: CurrencyModuleConfig): ModuleWithProviders<CurrencyModule> {
    return {
      ngModule: CurrencyModule,
      providers: [
        {
          provide: CurrencyApiService,
          useFactory: (httpClient: HttpClient) => new CurrencyApiService(httpClient, config.api),
          deps: [HttpClient],
        },
        CurrencyService,
      ],
    }
  }
}
