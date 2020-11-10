import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ToastrService } from 'ngx-toastr';

import { TranslatedError } from './models';

@Injectable()
export class NotificationService {
  constructor(
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
  ) {
  }

  public error(error: Error | TranslatedError): void {
    this.toastrService.error(this.isTranslatedError(error)
      ? error.message
      : this.translocoService.translate('toastr.errors.unknown_error')
    );
  }

  public success(message: string): void {
    this.toastrService.success(message);
  }

  private isTranslatedError(error: Error): error is TranslatedError {
    return error instanceof TranslatedError;
  }
}
