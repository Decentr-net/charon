import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
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
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, share } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { ControlValueAccessor, FormControl } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { QuillEditorComponent, Range, SelectionChange } from 'ngx-quill';

import { svgAddImage } from '@shared/svg-icons';
import { NotificationService } from '@shared/services/notification';
import { createFragmentWrappedContainer, decodeHtml } from '@shared/utils/html';

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
  @Input() public maxImagesCount: number;

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

  @ViewChild(QuillEditorComponent, { static: true }) public quillEditor: QuillEditorComponent;

  @ViewChild('addImageIcon', { static: false }) public addImageIcon: ElementRef<HTMLElement>;

  @HostBinding() public id = `hub-simple-text-editor-${HubSimpleTextEditorComponent.nextId++}`;

  @HostBinding('attr.aria-describedby') public describedBy = '';

  @HostBinding('class.hub-simple-text-editor') public hasHostClass: boolean = true;

  public controlType = 'hub-simple-text-editor';

  public errorState: boolean = false;

  public stateChanges = new Subject<void>();

  public focused: boolean = false;

  public isImageLimitReached: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public quillControl: FormControl<string> = new FormControl();

  private static nextId = 0;

  private selectionRange: Range;

  private quillEditorInstance: any;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    @Optional() private parentForm: NgForm,
    @Optional() private parentFormGroup: FormGroupDirective,
    private defaultErrorStateMatcher: ErrorStateMatcher,
    private elementRef: ElementRef<HTMLElement>,
    private focusMonitor: FocusMonitor,
    private notificationService: NotificationService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    super();

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    svgIconRegistry.register(svgAddImage);
  }

  public ngOnInit(): void {
    this.quillControl.valueChanges.pipe(
      map(Boolean),
      distinctUntilChanged(),
      untilDestroyed(this),
    ).subscribe(() => {
      this.stateChanges.next();
    });

    this.quillEditor.onEditorCreated.pipe(
      untilDestroyed(this),
    ).subscribe(({ editor }) => {
      this.quillEditorInstance = editor;
    });

    this.quillEditor.onEditorCreated.pipe(
      mergeMap(() => this.focusMonitor.monitor(this.quillEditor.quillEditor.root)),
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

    this.focusMonitor.stopMonitoring(this.quillEditor.editorElem);
  }

  public onBlur(): void {
    this.quillControl.setValue(this.getTrimmedText());
    this.onTouched();
  }

  @HostListener('document:click', ['$event.target'])
  public onDocumentClick(targetElement: Node): void {
    if (!this.elementRef.nativeElement.contains(targetElement)) {
      this.selectionRange = undefined;
    }
  }

  public get isImageLimitReached$(): Observable<boolean> {
    return this.isImageLimitReached.pipe(
      share(),
    );
  }

  public get empty(): boolean {
    return !this.quillControl.value?.length;
  }

  public get shouldLabelFloat(): boolean {
    return false;
  }

  public set value(value: string | null) {
    this.writeValue(value);
    this.stateChanges.next();
  }

  public onContainerClick(event: MouseEvent): void {
    if (!this.quillEditor.editorElem) {
      return;
    }

    if (![
      this.quillEditor?.editorElem,
      this.addImageIcon?.nativeElement,
    ].includes(event.target as HTMLElement)
    ) {
      this.quillEditor.editorElem.focus();
    }
  }

  public setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  public addImage(imageSrc: string): void {
    if (this.selectionRange) {
      this.quillEditorInstance.deleteText(this.selectionRange.index, this.selectionRange.length);
      this.quillEditorInstance.insertEmbed(this.selectionRange.index, 'image', imageSrc);
      this.quillControl.setValue(this.quillEditor.quillEditor.root.innerHTML);
      this.onTextInput();
    } else {
      const img = document.createElement('img');
      img.src = imageSrc;
      this.appendText(img.outerHTML);
    }
  }

  public onTextInput(): void {
    this.validateImagesCount();
    this.onChange(this.getTrimmedText());
  }

  public onSelectionChanged({ range }: SelectionChange): void {
    if (range) {
      this.selectionRange = range;
    }
  }

  public writeValue(value: string) {
    this.quillControl.setValue(value);
    this.validateImagesCount();
  }

  private appendText(text: string): void {
    const currentValue: string = typeof this.quillControl.value === 'string' ? this.quillControl.value : '';
    this.quillControl.setValue(currentValue + text);
    this.onTextInput();
  }

  private getImagesCount(): number {
    const container = createFragmentWrappedContainer();
    container.innerHTML = this.quillControl.value;
    return container.querySelectorAll('img').length;
  }

  private getTrimmedText(): string {
    return decodeHtml(this.quillControl.value).trim();
  }

  private validateImagesCount(): void {
    if (this.maxImagesCount) {
      this.isImageLimitReached.next(this.getImagesCount() >= this.maxImagesCount);
    }
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
