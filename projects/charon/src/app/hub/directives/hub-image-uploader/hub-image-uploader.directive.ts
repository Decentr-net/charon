import { Directive, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { EMPTY, fromEvent, Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, map, mergeMap, take, tap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NotificationService } from '@shared/services/notification';
import { MEGABYTE } from '@shared/utils/file';
import { TranslatedError } from '@core/notifications';
import { ImageUploaderService, SpinnerService } from '@core/services';

const MAX_IMAGE_SIZE = 32 * MEGABYTE;

@UntilDestroy()
@Directive({
  selector: '[appHubImageUploader]',
})
export class HubImageUploaderDirective implements OnInit {
  @Output('appHubImageUploader') public uploaded: EventEmitter<string> = new EventEmitter();

  private imageInput: HTMLInputElement;

  constructor(
    private imageUploader: ImageUploaderService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
  ) {
  }

  public ngOnInit(): void {
    this.imageInput = HubImageUploaderDirective.createImageInput();

    fromEvent(this.imageInput, 'change').pipe(
      map(() => this.imageInput.files[0]),
      filter((image) => !!image),
      tap(() => this.imageInput.value = ''),
      mergeMap((image) => {
        if (image.size > MAX_IMAGE_SIZE) {
          return this.translocoService.selectTranslate('hub_image_uploader.errors.max_size', null, 'hub').pipe(
            take(1),
            mergeMap((errorTranslate) => throwError(new TranslatedError(errorTranslate))),
          );
        }

        return of(image);
      }),
      mergeMap((image) => this.uploadImage(image)),
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
      untilDestroyed(this),
    ).subscribe((imageLink) => {
      this.uploaded.emit(imageLink);
    });
  }

  @HostListener('click')
  public onClick(): void {
    this.imageInput.click();
  }

  private uploadImage(image: File): Observable<string> {
    this.spinnerService.showSpinner();

    return this.imageUploader.upload(image).pipe(
      finalize(() => this.spinnerService.hideSpinner()),
    );
  }

  private static createImageInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    return input;
  }
}
