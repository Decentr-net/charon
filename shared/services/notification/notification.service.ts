import { Inject, Injectable, Optional } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { isObservable, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { ERROR_PROCESSOR, FALLBACK_ERROR_PROCESSOR } from './notification.tokens';
import { ConcreteErrorProcessor, ErrorProcessor } from './error-processor';

@Injectable()
export class NotificationService {
  constructor(
    private toastrService: ToastrService,
    @Inject(ERROR_PROCESSOR) @Optional() private errorProcessors: ConcreteErrorProcessor[],
    @Inject(FALLBACK_ERROR_PROCESSOR) @Optional() private fallbackErrorProcessor: ErrorProcessor,
  ) {
  }

  public error(error: unknown, title?: string, override?: Partial<IndividualConfig>): void {
    let processor: ErrorProcessor = this.errorProcessors
      .find((errorProcessor) => errorProcessor.canProcess(error));

    if (!processor) {
      processor = this.fallbackErrorProcessor;
    }

    const processedError = processor ? processor.process(error) : 'Unknown error';
    const errorObservable = isObservable(processedError) ? processedError : of(processedError);

    errorObservable.pipe(
      take(1),
    ).subscribe((message: string) => {
      this.toastrService.error(message, title, override);
    });
  }

  public success(message: string, title?: string, override?: Partial<IndividualConfig>): void {
    this.toastrService.success(message, title, override);
  }

  public warning(message: string, title?: string, override?: Partial<IndividualConfig>): void {
    this.toastrService.warning(message, title, override);
  }
}
