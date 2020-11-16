import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-circle-navigation',
  templateUrl: './circle-navigation.component.html',
  styleUrls: ['./circle-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleNavigationComponent {
}
