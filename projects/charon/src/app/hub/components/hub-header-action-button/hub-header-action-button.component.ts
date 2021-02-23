import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-hub-header-action-button',
  templateUrl: './hub-header-action-button.component.html',
  styleUrls: ['./hub-header-action-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubHeaderActionButtonComponent {
  @Input() public icon: string;
}
