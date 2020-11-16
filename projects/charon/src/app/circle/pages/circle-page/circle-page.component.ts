import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-circle-page',
  templateUrl: './circle-page.component.html',
  styleUrls: ['./circle-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePageComponent {
}
