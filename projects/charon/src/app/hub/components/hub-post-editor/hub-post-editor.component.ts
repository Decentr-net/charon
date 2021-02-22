import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ControlValueAccessor, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { PostCreate } from 'decentr-js';

import { svgAddImage, svgClose } from '@shared/svg-icons';
import { BaseValidationUtil } from '@shared/utils/validation';

const MAX_IMAGES_COUNT: number = 5;

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
export class HubPostEditorComponent extends ControlValueAccessor<PostCreate> implements OnInit {
  public form: FormGroup<PostCreate>;

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
  }

  public ngOnInit() {
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

  public onTitleImageUpload(imageSrc: string): void {
    this.form.patchValue({
      previewImage: imageSrc,
    });
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
          BaseValidationUtil.maxHTMLImages(MAX_IMAGES_COUNT),
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
