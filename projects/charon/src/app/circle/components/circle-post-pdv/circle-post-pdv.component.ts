import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-circle-post-pdv',
  templateUrl: './circle-post-pdv.component.html',
  styleUrls: ['./circle-post-pdv.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePostPdvComponent {
  @Input() public pdv: number;

  @HostBinding('class.mod-negative')
  public get isNegative(): boolean {
    return this.pdv < 0;
  }

  @HostBinding('class.mod-positive')
  public get isPositive(): boolean {
    return !this.isNegative;
  }
}
