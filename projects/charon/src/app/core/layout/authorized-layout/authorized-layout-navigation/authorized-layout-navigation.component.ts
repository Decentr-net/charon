import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthorizedLayoutNavigationLinkDefDirective } from '../authorized-layout-navigation-link';
import { AuthorizedLayoutNavigationService } from './authorized-layout-navigation.service';
import { AuthorizedLayoutNavigationDefDirective } from './authorized-layout-navigation-def.directive';

@Component({
  selector: 'app-authorized-layout-navigation',
  templateUrl: './authorized-layout-navigation.component.html',
  styleUrls: ['./authorized-layout-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedLayoutNavigationComponent implements OnInit {
  public linksDefs$: Observable<AuthorizedLayoutNavigationLinkDefDirective[]>;

  constructor(
    private authorizedLayoutNavigationService: AuthorizedLayoutNavigationService,
  ) {
  }

  public ngOnInit(): void {
    this.linksDefs$ = this.authorizedLayoutNavigationService.getCurrentNavigation().pipe(
      switchMap((navigation: AuthorizedLayoutNavigationDefDirective) => navigation?.getLinksDefs() || of([])),
    );
  }
}
