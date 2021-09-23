import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@ngneat/reactive-forms';

import { USER_AVATARS } from '../../avatar';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { svgCheck } from '../../../svg-icons/check';

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AvatarSelectorComponent,
      multi: true,
    },
  ],
})
export class AvatarSelectorComponent extends ControlValueAccessor<string> implements AfterViewInit {
  public avatars: string[] = USER_AVATARS;
  public value: string;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private svgIconRegistry: SvgIconRegistry,
  ) {
    super();

    svgIconRegistry.register([
      svgCheck,
    ]);
  }

  public ngAfterViewInit(): void {
    this.value = this.value || this.avatars[0];
    this.onChange(this.value);
    this.changeDetectorRef.markForCheck();
  }

  public select(avatar: string): void {
    this.value = avatar;
    this.onChange(this.value);
  }

  public writeValue(value: any): void {
    this.value = value;
    this.changeDetectorRef.detectChanges();
  }
}
