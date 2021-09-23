import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgEmailConfirmed } from '@shared/svg-icons/email-confirmed';
import { AuthService } from '@core/auth';

@Component({
  selector: 'app-email-confirmed-card',
  templateUrl: './email-confirmed-card.component.html',
  styleUrls: ['./email-confirmed-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmedCardComponent implements OnInit {
  public email$: Observable<string>;

  constructor(
    private authService: AuthService,
    private svgIconRegistry: SvgIconRegistry,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgEmailConfirmed,
    ]);

    this.email$ = this.authService.getActiveUser().pipe(
      pluck('primaryEmail'),
    );
  }
}
