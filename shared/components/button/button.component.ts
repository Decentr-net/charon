import { ChangeDetectionStrategy, Component, ContentChild, HostBinding, Input } from '@angular/core';
import { SvgIconComponent } from '@ngneat/svg-icon';

@Component({
  selector: 'button[app-button], button[app-icon-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() public color: 'negative' | 'primary' | 'grey' = 'primary';

  @Input() public size: 'xs' | 'sm' | 'md' = 'md';

  @HostBinding('attr.type')
  @Input()
  public type: 'submit' | 'button' = 'button';

  @HostBinding('class')
  public get classes(): string {
    return `mod-size-${this.size} mod-color-${this.color}`;
  }

  @HostBinding('class.mod-with-icon')
  @ContentChild(SvgIconComponent)
  public svgIcon: SvgIconComponent;
}
