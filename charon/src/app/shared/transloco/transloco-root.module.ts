import { Injectable, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoConfig,
  TranslocoModule,
} from '@ngneat/transloco';

import { Environment } from '@environments/environment.definitions';

@Injectable({
  providedIn: 'root',
})
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {
  }

  public getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

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
