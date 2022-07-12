import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: '',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  @HostBinding('style.height.px')
  @HostBinding('style.width.px')
  @Input()
  public size: number = 50;
}
