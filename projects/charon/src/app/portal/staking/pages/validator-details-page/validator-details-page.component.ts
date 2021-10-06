import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ValidatorDetailsPageService } from './validator-details-page.service';

@Component({
  selector: 'app-validator-details-page',
  templateUrl: './validator-details-page.component.html',
  styleUrls: ['./validator-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ValidatorDetailsPageService,
  ],
})
export class ValidatorDetailsPageComponent {
}
