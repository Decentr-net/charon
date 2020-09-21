import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-network-selector',
  templateUrl: './network-selector.component.html',
  styleUrls: ['./network-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkSelectorComponent {
}
