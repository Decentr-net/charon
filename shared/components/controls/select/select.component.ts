import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Optional,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { isOpenedInTab } from '../../../utils/browser';
import { SubmitSourceDirective } from '../../../directives/submit-source';
import { svgDropdownExpand } from '../../../svg-icons/dropdown-expand';
import { InputContainerControl } from '../../input-container';
import { CustomControl } from '../custom-control';
import { SelectOption } from './select.definitions';

@UntilDestroy()
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: InputContainerControl,
      useExisting: SelectComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T> extends CustomControl<string> implements OnInit {
  @Input() public options: SelectOption<T>[] = [];

  @Input() public displayWithFn: (option: T) => string;

  @Input() public placeholder: string;

  @ViewChild('inputElement') public inputElement: ElementRef<HTMLElement>;

  @ViewChild(MatAutocompleteTrigger) public trigger: MatAutocompleteTrigger;

  private isFocused: boolean;

  public isOpenedInPopup: boolean = !isOpenedInTab();

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
      svgDropdownExpand,
    ]);

    this.init();
  }

  public onFocus(): void {
    this.isFocused = true;
  }

  public onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  public openAutocomplete(): void {
    timer(0).pipe(
      filter(() => this.trigger.panelOpen),
      untilDestroyed(this),
    ).subscribe(() => this.trigger.openPanel());
  }

  public onValueChange(date: string): void {
    this.value = date;
    this.onChange(this.value);
  }
}
