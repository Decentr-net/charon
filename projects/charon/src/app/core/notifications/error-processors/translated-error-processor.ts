import { Injectable } from '@angular/core';

import { ConcreteErrorProcessor } from '@shared/services/notification';
import { TranslatedError } from '../models';

@Injectable()
export class TranslatedErrorProcessor extends ConcreteErrorProcessor {
  public canProcess(error: unknown): boolean {
    return error instanceof TranslatedError;
  }

  public process(error: TranslatedError): string {
    return error.message;
  }
}
