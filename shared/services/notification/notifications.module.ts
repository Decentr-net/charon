import { ClassProvider, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { coerceArray } from '@angular/cdk/coercion';

import { ConcreteErrorProcessor, ErrorProcessor } from './error-processor';
import { NotificationService } from './notification.service';
import { ERROR_PROCESSOR, FALLBACK_ERROR_PROCESSOR } from './notification.tokens';

@NgModule({
  providers: [NotificationService]
})
export class NotificationsModule {
  public static forRoot(config: {
    errorProcessors?: Type<ConcreteErrorProcessor>[],
    fallbackErrorProcessor?: Type<ErrorProcessor>,
  }): ModuleWithProviders<NotificationsModule> {
    return {
      ngModule: NotificationsModule,
      providers: [
        this.getErrorProcessorsProviders(config?.errorProcessors || []),
        ...config?.fallbackErrorProcessor
          ? [{
            provide: FALLBACK_ERROR_PROCESSOR,
            useClass: config?.fallbackErrorProcessor
          }]
          : []
      ]
    };
  }

  public static forChild(config?: {
    errorProcessors?: Type<ErrorProcessor>[],
  }): ModuleWithProviders<NotificationsModule> {
    return {
      ngModule: NotificationsModule,
      providers: this.getErrorProcessorsProviders(config?.errorProcessors || []),
    };
  }

  private static getErrorProcessorsProviders(errorProcessors: Type<ErrorProcessor> | Type<ErrorProcessor>[]): ClassProvider[] {
    return coerceArray(errorProcessors).map((errorProcessor) => ({
      provide: ERROR_PROCESSOR,
      useClass: errorProcessor,
      multi: true,
    }));
  }
}
