import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthorizedLayoutNavigationLinkDefDirective } from '../authorized-layout-navigation-link';
import { AuthorizedLayoutNavigationService } from './authorized-layout-navigation.service';
import { AuthorizedLayoutNavigationDefDirective } from './authorized-layout-navigation-def.directive';

export const AUTHORIZED_LAYOUT_NAVIGATION_RIGHT_SLOT = Symbol('AUTHORIZED_LAYOUT_NAVIGATION_RIGHT_SLOT');

@Component({
  selector: 'app-authorized-layout-navigation',
  templateUrl: './authorized-layout-navigation.component.html',
  styleUrls: ['./authorized-layout-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedLayoutNavigationComponent implements OnInit {
  public readonly rightSlotName: Symbol = AUTHORIZED_LAYOUT_NAVIGATION_RIGHT_SLOT;

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
