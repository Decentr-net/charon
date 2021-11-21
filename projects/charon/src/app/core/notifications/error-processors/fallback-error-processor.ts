import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

import { ErrorProcessor } from '@shared/services/notification';

@Injectable()
export class FallbackErrorProcessor extends ErrorProcessor {
  constructor(private translocoService: TranslocoService) {
    super();
  }

  public process(): Observable<string> {
    return this.translocoService.selectTranslate('notifications.unknown_error', null, 'core');
  }
}
