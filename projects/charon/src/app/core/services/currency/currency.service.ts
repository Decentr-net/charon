import { Injectable } from '@angular/core';

import { CurrencyService as SharedCurrencyService } from '@shared/services/currency';
import { Environment } from '@environments/environment.definitions';

@Injectable()
export class CurrencyService extends SharedCurrencyService {

  constructor(
    environment: Environment,
  ) {
    super(
      environment,
    );
  }
}
