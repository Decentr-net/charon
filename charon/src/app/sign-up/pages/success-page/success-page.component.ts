import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessPageComponent {
}
