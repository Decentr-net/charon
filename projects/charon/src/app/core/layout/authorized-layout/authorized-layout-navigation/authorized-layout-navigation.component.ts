import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthorizedLayoutNavigationLinkDefDirective } from '../authorized-layout-navigation-link';
import { AuthorizedLayoutNavigationService } from './authorized-layout-navigation.service';
import { AuthorizedLayoutNavigationDefDirective } from './authorized-layout-navigation-def.directive';

@UntilDestroy()
@Component({
  selector: 'app-authorized-layout-navigation',
  templateUrl: './authorized-layout-navigation.component.html',
  styleUrls: ['./authorized-layout-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedLayoutNavigationComponent implements OnInit {
  public linksDefs: AuthorizedLayoutNavigationLinkDefDirective[];

  constructor(
    private authorizedLayoutNavigationService: AuthorizedLayoutNavigationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    this.authorizedLayoutNavigationService.getCurrentNavigation().pipe(
      switchMap((navigation: AuthorizedLayoutNavigationDefDirective) => navigation?.getLinksDefs() || of([])),
      untilDestroyed(this),
    ).subscribe((linksDefs) => {
      this.linksDefs = linksDefs;
      this.changeDetectorRef.detectChanges();
    });
  }
}
