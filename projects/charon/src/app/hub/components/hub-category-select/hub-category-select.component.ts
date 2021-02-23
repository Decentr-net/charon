import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { PostCategory } from 'decentr-js';

import { POST_CATEGORIES, POST_CATEGORY_TRANSLATION_MAP } from '../../models/post-category';

@Component({
  selector: 'app-hub-category-select',
  templateUrl: './hub-category-select.component.html',
  styleUrls: ['./hub-category-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: HubCategorySelectComponent,
      multi: true,
    },
  ],
})
export class HubCategorySelectComponent extends ControlValueAccessor<PostCategory> {
  public value: PostCategory;

  public categories: PostCategory[] = POST_CATEGORIES;

  public translationMap: Record<PostCategory, string> = POST_CATEGORY_TRANSLATION_MAP;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  public onCategorySelect(category: PostCategory): void {
    this.value = category;
    this.onChange(category);
  }

  public writeValue(value: PostCategory): void {
    this.value = value;
    this.changeDetectorRef.detectChanges();
  }
}
