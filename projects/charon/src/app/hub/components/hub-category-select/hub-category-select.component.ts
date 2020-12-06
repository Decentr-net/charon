import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { PostCategory } from 'decentr-js';

const POST_CATEGORY_TRANSLATION_MAP: Record<PostCategory, string> = {
  [PostCategory.FitnessAndExercise]: 'fitness_and_exercise',
  [PostCategory.HealthAndCulture]: 'health_and_culture',
  [PostCategory.ScienceAndTechnology]: 'science_and_technology',
  [PostCategory.StrangeWorld]: 'strange_world',
  [PostCategory.TravelAndTourism]: 'travel_and_tourism',
  [PostCategory.WorldNews]: 'world_news',
}

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

  public categories: PostCategory[] = [
    PostCategory.WorldNews,
    PostCategory.ScienceAndTechnology,
    PostCategory.HealthAndCulture,
    PostCategory.FitnessAndExercise,
    PostCategory.StrangeWorld,
    PostCategory.TravelAndTourism,
  ];

  public translationMap: Record<PostCategory, string> = POST_CATEGORY_TRANSLATION_MAP;

  public onCategorySelect(category: PostCategory): void {
    this.value = category;
    this.onChange(category);
  }

  public writeValue(value: PostCategory): void {
    this.value = value;
  }
}
