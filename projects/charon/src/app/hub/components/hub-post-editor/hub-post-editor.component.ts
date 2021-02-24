import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PostCategory, PostCreate } from 'decentr-js';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { svgAddImage, svgClose } from '@shared/svg-icons';
import { BaseValidationUtil } from '@shared/utils/validation';
import { getHTMLImagesCount } from '@shared/utils/html';

const DEFAULT_POST_CATEGORY = PostCategory.WorldNews;

@UntilDestroy()
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
    {
      provide: NG_VALIDATORS,
      useExisting: HubPostEditorComponent,
      multi: true,
    },
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'hub.hub_post_editor',
    },
  ],
})
export class HubPostEditorComponent extends ControlValueAccessor<PostCreate> implements Validator {
  @Input() public formId: string;

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

    this.form.value$.pipe(
      untilDestroyed(this),
    ).subscribe((value) => this.onChange(value));
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

  public validate(control: AbstractControl<PostCreate>): ValidationErrors | null {
    return this.form.valid ? null : { invalid: {} };
  }

  public writeValue(value: PostCreate): void {
    if (!value) {
      return this.form.reset({
        category: DEFAULT_POST_CATEGORY,
      });
    }

    this.form.setValue({
      category: DEFAULT_POST_CATEGORY,
      ...value,
    });
  }

  private createForm(): FormGroup<PostCreate> {
    return this.formBuilder.group({
      category: [
        DEFAULT_POST_CATEGORY,
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
          Validators.minLength(3),
          Validators.maxLength(150),
        ],
      ],
    })
  }
}
