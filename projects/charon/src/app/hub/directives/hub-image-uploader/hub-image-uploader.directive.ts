import { Directive, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { EMPTY, fromEvent, Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, map, mergeMap, repeat, take, tap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NotificationService } from '@shared/services/notification';
import { MEGABYTE } from '@shared/utils/file';
import { TranslatedError } from '@core/notifications';
import { ImageUploaderService, SpinnerService } from '@core/services';

const MAX_IMAGE_SIZE = 32 * MEGABYTE;
const IMAGE_PATTERN = /(image)*\/(?:jpg|jpeg|png)/;
const IMAGE_ACCEPT_FORMATS = '.jpg,.jpeg,.png';

@UntilDestroy()
@Directive({
  selector: '[appHubImageUploader]',
  exportAs: 'appHubImageUploader',
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
        let errorKey = '';

        if (image.size > MAX_IMAGE_SIZE) {
          errorKey = 'max_size';
        }

        if (!image.type.match(IMAGE_PATTERN)) {
          errorKey = 'not_allowed_type';
        }

        return errorKey
          ? this.translocoService.selectTranslate(`hub_image_uploader.errors.${errorKey}`, null, 'hub').pipe(
            take(1),
            mergeMap((errorTranslate) => throwError(new TranslatedError(errorTranslate))),
          )
          : of(image);
      }),
      mergeMap((image) => this.uploadImage(image)),
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
      repeat(),
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
    input.accept = IMAGE_ACCEPT_FORMATS;

    return input;
  }
}
