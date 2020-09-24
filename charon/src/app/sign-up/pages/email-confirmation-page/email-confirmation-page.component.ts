import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

export const EMAIL_QUERY_PARAM = 'email';

@Component({
  selector: 'app-email-confirmation-page',
  templateUrl: './email-confirmation-page.component.html',
  styleUrls: ['./email-confirmation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmationPageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public email$: Observable<string>;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit() {
    this.email$ = this.activatedRoute.queryParams.pipe(
      pluck(EMAIL_QUERY_PARAM)
    );
  }
}
