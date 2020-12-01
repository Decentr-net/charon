import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'button[app-hub-load-more-button]',
  templateUrl: './hub-load-more-button.component.html',
  styleUrls: ['./hub-load-more-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubLoadMoreButtonComponent {
}
