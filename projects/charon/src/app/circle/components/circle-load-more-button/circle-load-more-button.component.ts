import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'button[app-circle-load-more-button]',
  templateUrl: './circle-load-more-button.component.html',
  styleUrls: ['./circle-load-more-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleLoadMoreButtonComponent {
}
