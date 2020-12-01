import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-my-wall-page',
  templateUrl: './my-wall-page.component.html',
  styleUrls: ['./my-wall-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyWallPageComponent {
}
