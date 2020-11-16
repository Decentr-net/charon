import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-circle-header',
  templateUrl: './circle-header.component.html',
  styleUrls: ['./circle-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleHeaderComponent {
}
