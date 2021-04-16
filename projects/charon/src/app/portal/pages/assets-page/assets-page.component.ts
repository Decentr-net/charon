import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-assets-page',
  templateUrl: './assets-page.component.html',
  styleUrls: ['./assets-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsPageComponent {
}
