import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Translation, TranslocoLoader } from '@ngneat/transloco';

@Injectable()
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {
  }

  public getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`assets/i18n/${lang}.json`);
  }
}
