import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgCongratulations } from '@shared/svg-icons/congratulations';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessPageComponent implements OnInit {

  constructor(
    private svgIconRegistry: SvgIconRegistry,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgCongratulations,
    ]);
  }
}
