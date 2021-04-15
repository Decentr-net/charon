import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthorizedLayoutNavigationService } from './authorized-layout-navigation';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-authorized-layout',
  templateUrl: './authorized-layout.component.html',
  styleUrls: ['./authorized-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AuthorizedLayoutNavigationService,
  ],
})
export class AuthorizedLayoutComponent implements OnInit {
  public hasNavigation$: Observable<boolean>;

  constructor(
    private authorizedLayoutNavigationService: AuthorizedLayoutNavigationService,
  ) {
  }

  public ngOnInit(): void {
    this.hasNavigation$ = this.authorizedLayoutNavigationService.getCurrentNavigation().pipe(
      map(Boolean),
    );
  }
}
