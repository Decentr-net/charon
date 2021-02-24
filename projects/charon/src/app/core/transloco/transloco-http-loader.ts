import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { SKIP_MAINTENANCE_INTERCEPTOR_HEADER } from '@core/interceptors';

@Injectable()
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {
  }

  public getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`assets/i18n/${lang}.json`, {
      headers: {
        [SKIP_MAINTENANCE_INTERCEPTOR_HEADER]: 'true',
      },
    });
  }
}
