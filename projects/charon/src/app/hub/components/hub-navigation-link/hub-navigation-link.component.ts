import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-hub-navigation-link',
  templateUrl: './hub-navigation-link.component.html',
  styleUrls: ['./hub-navigation-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubNavigationLinkComponent {
  @Input() public id: number;
  @Input() public link: string | string[];
  @Input() public title: string;
}
