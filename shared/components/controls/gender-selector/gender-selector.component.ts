import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Optional,
  Renderer2,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Gender } from 'decentr-js';

import { isOpenedInTab } from '../../../utils/browser';
import { SubmitSourceDirective } from '../../../directives/submit-source';
import { InputContainerControl } from '../../input-container';
import { CustomControl } from '../custom-control';
import { GenderSelectorTranslations } from './gender-selector.definitions';

@UntilDestroy()
@Component({
  selector: 'app-gender-selector',
  styleUrls: ['./gender-selector.component.scss'],
  templateUrl: './gender-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: InputContainerControl,
      useExisting: GenderSelectorComponent,
    },
  ],
})
export class GenderSelectorComponent extends CustomControl<Gender> implements OnInit {
  @Input() public placeholder: string;

  @Input() public translations: GenderSelectorTranslations = {
    [Gender.Female]: Gender.Female,
    [Gender.Male]: Gender.Male,
  };

  public isOpenedInPopup: boolean = !isOpenedInTab();

  public gender: typeof Gender = Gender;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef<HTMLElement>,
    ngControl: NgControl,
    renderer2: Renderer2,
    @Optional() submitSource: SubmitSourceDirective,
  ) {
    super(
      changeDetectorRef,
      elementRef,
      ngControl,
      renderer2,
      submitSource,
    );
  }

  public ngOnInit(): void {
    this.init();
  }

  public onValueChange(newValue: Gender): void {
    this.value = newValue;
    this.onChange(this.value);
  }
}
