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
import { AbstractControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { combineLatest, merge } from 'rxjs';
import { distinctUntilChanged, map, mapTo, startWith, switchMap } from 'rxjs/operators';
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
  @Input() public position: 'top' | 'bottom' = 'bottom';

  public display: boolean;

  constructor(
    @Optional() private controlContainer: ControlContainer,
    @Optional() private formGroup: FormGroupDirective,
    private elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
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

    const display$ = combineLatest([hasError$, isSubmitted$]).pipe(
      map((conditions) => conditions.every(Boolean)),
      distinctUntilChanged(),
    );

    display$.pipe(
      untilDestroyed(this),
    ).subscribe((display) => {
      this.display = display;
      this.changeDetectorRef.detectChanges();
      this.updatePosition();
    });
  }

  private updatePosition(): void {
    this.renderer2.setStyle(
      this.elementRef.nativeElement,
      'top',
      (
        this.position === 'top'
          ? -this.elementRef.nativeElement.offsetHeight
          : this.anchorElement.offsetTop + this.anchorElement.offsetHeight
      ) + 'px',
    );

    this.renderer2.setStyle(
      this.elementRef.nativeElement,
      'left',
      this.anchorElement.offsetLeft + 'px',
    );
  }
}
