import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-hub-post-pdv',
  templateUrl: './hub-post-pdv.component.html',
  styleUrls: ['./hub-post-pdv.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostPdvComponent {
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
