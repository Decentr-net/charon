import { Inject, Injectable, Optional } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  public error(error: unknown): void {
    let processor: ErrorProcessor = this.errorProcessors.find(processor => processor.canProcess(error));

    if (!processor) {
      processor = this.fallbackErrorProcessor;
    }

    const processedError = processor ? processor.process(error) : 'Unknown error';
    const errorObservable = isObservable(processedError) ? processedError : of(processedError);

    errorObservable.pipe(
      take(1)
    ).subscribe((message: string) => {
      this.toastrService.error(message);
    });
  }

  public success(message: string): void {
    this.toastrService.success(message);
  }

  public warning(message: string): void {
    this.toastrService.warning(message);
  }
}
