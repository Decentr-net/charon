import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Optional,
  Renderer2
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy } from '@ngneat/until-destroy';

import { svgCheck } from '../../../svg-icons/check';
import { InputContainerControl } from '../../input-container';
import { CustomControl } from '../custom-control';
import { SubmitSourceDirective } from '../../../directives/submit-source';

@UntilDestroy()
@Component({
  selector: 'app-checkbox',
  styleUrls: ['./checkbox.component.scss'],
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: InputContainerControl,
      useExisting: CheckboxComponent,
    },
  ],
})
export class CheckboxComponent extends CustomControl<boolean> implements OnInit {
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef<HTMLElement>,
    ngControl: NgControl,
    renderer2: Renderer2,
    private svgIconRegistry: SvgIconRegistry,
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
    this.svgIconRegistry.register([
      svgCheck,
    ]);

    this.init();
  }

  public toggle(): void {
    this.value = !this.value;
    this.onChange(this.value);

    this.onTouched();
  }
}
