import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  Optional,
  Renderer2,
} from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { combineLatest, merge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, startWith, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-hub-post-editor-error',
  templateUrl: './hub-post-editor-error.component.html',
  styleUrls: ['./hub-post-editor-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostEditorErrorComponent implements OnInit {
  @Input() public anchorElement: HTMLElement;
  @Input() public control: AbstractControl;
  @Input() public controlName: string;
  @Input() public i18nControlKey: string;

  public display$: Observable<boolean>;

  constructor(
    @Optional() private controlContainer: ControlContainer,
    @Optional() private formGroup: FormGroupDirective,
    private elementRef: ElementRef<HTMLElement>,
    private renderer2: Renderer2,
  ) {
  }

  public ngOnInit(): void {
    const control = this.control || this.controlContainer.control.get(this.controlName.toString());

    const hasError$ = merge(
      control.statusChanges,
      control.valueChanges,
    ).pipe(
      startWith(void 0),
      map(() => !!control.errors),
      distinctUntilChanged(),
    );

    const isSubmitted$ = control.statusChanges.pipe(
      startWith(void 0),
      switchMap(() => this.formGroup.ngSubmit.pipe(
        mapTo(true),
        startWith(false),
      )),
      distinctUntilChanged(),
    );

    this.display$ = combineLatest([hasError$, isSubmitted$]).pipe(
      map((conditions) => conditions.every(Boolean)),
      distinctUntilChanged(),
    );

    this.display$.pipe(
      filter(Boolean),
      untilDestroyed(this),
    ).subscribe(() => this.updatePosition());
  }

  private updatePosition(): void {
    this.renderer2.setStyle(
      this.elementRef.nativeElement,
      'top',
      this.anchorElement.offsetTop + this.anchorElement.offsetHeight + 'px',
    );

    this.renderer2.setStyle(
      this.elementRef.nativeElement,
      'left',
      this.anchorElement.offsetLeft + 'px',
    );
  }
}
