import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppRoute } from '../../../app-route';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessPageComponent {
}
