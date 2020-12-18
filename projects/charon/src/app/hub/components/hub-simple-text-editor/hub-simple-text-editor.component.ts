import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { ControlValueAccessor, FormControl } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgAddImage } from '@shared/svg-icons';

@UntilDestroy()
@Component({
  selector: 'app-hub-simple-text-editor',
  templateUrl: './hub-simple-text-editor.component.html',
  styleUrls: ['./hub-simple-text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: HubSimpleTextEditorComponent,
    },
  ],
})
export class HubSimpleTextEditorComponent
  extends ControlValueAccessor<string>
  implements MatFormFieldControl<string>, OnInit, DoCheck, OnDestroy
{
  @Input()
  @HostBinding('class.is-disabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get required() {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @ViewChild('textContainer', { static: true }) public textContainer: ElementRef<HTMLDivElement>;

  @HostBinding() public id = `hub-simple-text-editor-${HubSimpleTextEditorComponent.nextId++}`;

  @HostBinding('attr.aria-describedby') public describedBy = '';

  @HostBinding('class.hub-simple-text-editor') public hasHostClass: boolean = true;

  public controlType = 'hub-simple-text-editor';

  public errorState: boolean = false;

  public stateChanges = new Subject<void>();

  public focused: boolean = false;

  private static nextId = 0;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    @Optional() private parentForm: NgForm,
    @Optional() private parentFormGroup: FormGroupDirective,
    private defaultErrorStateMatcher: ErrorStateMatcher,
    private focusMonitor: FocusMonitor,
    svgIconRegistry: SvgIconRegistry
  ) {
    super();

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    svgIconRegistry.register(svgAddImage);
  }

  public ngOnInit(): void {
    this.focusMonitor.monitor(this.textContainerElement).pipe(
      untilDestroyed(this),
    ).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  public ngDoCheck(): void {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  public ngOnDestroy(): void {
    this.stateChanges.complete();

    this.focusMonitor.stopMonitoring(this.textContainerElement);
  }

  public onBlur(): void {
    this.onTouched();
  }

  public get empty(): boolean {
    return this.textContainerElement.innerHTML.length === 0;
  }

  public get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  private get textContainerElement(): HTMLDivElement {
    return this.textContainer.nativeElement;
  }

  public set value(value: string | null) {
    this.writeValue(value);
    this.stateChanges.next();
  }

  public onContainerClick(event: MouseEvent): void {
    if ((event.target as Element) !== this.textContainerElement) {
      this.textContainerElement.focus();
    }
  }

  public setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  public addImage(): void {
    const imageSrc = prompt('Enter image url');

    const img = document.createElement('img');
    img.src = imageSrc;

    this.appendText(img.outerHTML);
  }

  public onTextInput(): void {
    this.onChange(this.textContainerElement.innerHTML);
  }

  public writeValue(value: string) {
    this.textContainerElement.innerHTML = value;
  }

  private appendText(text: string): void {
    this.textContainerElement.innerHTML += text;
    this.onTextInput();
  }

  private updateErrorState(): void {
    const oldState = this.errorState;
    const parent = this.parentFormGroup || this.parentForm;
    const matcher = this.defaultErrorStateMatcher;
    const control = this.ngControl ? this.ngControl.control as FormControl<string> : null;
    const newState = matcher.isErrorState(control, parent);

    if (newState !== oldState) {
      this.errorState = newState;
      this.stateChanges.next();
    }
  }
}
