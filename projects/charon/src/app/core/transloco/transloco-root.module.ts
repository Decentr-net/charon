import { NgModule } from '@angular/core';
import {
  TRANSLOCO_LOADER,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoConfig,
  TranslocoModule,
} from '@ngneat/transloco';

import { Environment } from '@environments/environment.definitions';
import { TranslocoHttpLoader } from './transloco-http-loader';

export function getTranslocoConfig(environment: Environment): TranslocoConfig {
  return translocoConfig({
    availableLangs: ['en'],
    defaultLang: 'en',
    fallbackLang: 'en',
    reRenderOnLangChange: true,
    prodMode: environment.production,
  });
}

@NgModule({
  exports: [
    TranslocoModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useFactory: getTranslocoConfig,
      deps: [Environment],
    },
    {
      provide: TRANSLOCO_LOADER,
      useClass: TranslocoHttpLoader,
    },
  ],
})
export class TranslocoRootModule {
}
