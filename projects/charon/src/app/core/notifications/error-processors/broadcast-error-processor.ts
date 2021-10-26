import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { BroadcastClientError } from 'decentr-js';

import { ConcreteErrorProcessor } from '@shared/services/notification';

@Injectable()
export class BroadcastErrorProcessor extends ConcreteErrorProcessor {
  constructor(private translocoService: TranslocoService) {
    super();
  }

  public canProcess(error: unknown): boolean {
    return error && !!(error as BroadcastClientError).broadcastErrorCode;
  }

  public process(error: BroadcastClientError): Observable<string> {
    return this.translocoService.selectTranslate(
      `notifications.broadcast_error.${error.broadcastErrorCode}`,
      null,
      'core',
    );
  }
}
