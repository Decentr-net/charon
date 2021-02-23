import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ControlValueAccessor, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { PostCreate } from 'decentr-js';

import { svgAddImage, svgClose } from '@shared/svg-icons';
import { BaseValidationUtil } from '@shared/utils/validation';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { getHTMLImagesCount } from '../../../../../../../shared/utils/html';

@Component({
  selector: 'app-hub-post-editor',
  templateUrl: './hub-post-editor.component.html',
  styleUrls: ['./hub-post-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: HubPostEditorComponent,
      multi: true,
    },
  ],
})
export class HubPostEditorComponent extends ControlValueAccessor<PostCreate> {
  public form: FormGroup<PostCreate>;

  public imagesCount$: Observable<number>;
  public readonly maxImagesCount = 5;
  public imageLimitReached$: Observable<boolean>;

  public textImagePositionTop: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    svgIconRegistry: SvgIconRegistry,
  ) {
    super();

    svgIconRegistry.register([
      svgAddImage,
      svgClose,
    ]);

    this.form = this.createForm();

    this.imagesCount$ = this.form.get('text').valueChanges.pipe(
      startWith(this.form.get('text').value),
      distinctUntilChanged((prev, curr) => Math.abs(prev.length - curr.length) < '<img>'.length),
      map(getHTMLImagesCount),
    );

    this.imageLimitReached$ = this.imagesCount$.pipe(
      map((imagesCount) => imagesCount >= this.maxImagesCount),
    );
  }

  @HostBinding('class.mod-has-preview-image')
  public get previewImage(): string {
    return this.form.get('previewImage').value;
  }

  public clearPreviewImage(): void {
    this.form.patchValue({
      previewImage: null,
    });
  }

  public onTextCursorPositionChange(positionTop: number): void {
    const lineHeight = 24;
    this.textImagePositionTop = positionTop >= lineHeight ? positionTop : 0;
  }

  public onTitleImageUpload(imageSrc: string): void {
    this.form.patchValue({
      previewImage: imageSrc,
    });
  }

  public preventEvent(event: Event): void {
    event.preventDefault();
  }

  public writeValue(value: PostCreate): void {
    this.form.setValue(value);
  }

  private createForm(): FormGroup<PostCreate> {
    return this.formBuilder.group({
      category: [
        null,
        Validators.required,
      ],
      previewImage: [
        null,
      ],
      text: [
        '',
        [
          Validators.required,
          BaseValidationUtil.minHtmlTextLength(15),
          BaseValidationUtil.maxHTMLImages(this.maxImagesCount),
          BaseValidationUtil.maxStringBytes(64000),
        ],
      ],
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(150),
        ],
      ],
    })
  }
}
