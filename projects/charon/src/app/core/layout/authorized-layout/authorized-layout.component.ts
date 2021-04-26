import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { isOpenedInTab } from '@shared/utils/browser';
import { AuthorizedLayoutNavigationService } from './authorized-layout-navigation';
import { AuthorizedLayoutService } from './authorized-layout.service';

@UntilDestroy()
@Component({
  selector: 'app-authorized-layout',
  templateUrl: './authorized-layout.component.html',
  styleUrls: ['./authorized-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AuthorizedLayoutNavigationService,
    AuthorizedLayoutService,
  ],
})
export class AuthorizedLayoutComponent implements OnInit {
  @HostBinding('class.mod-popup-view') public isOpenedInPopup: boolean;

  public hasNavigation: boolean;

  public footerTemplate$: Observable<TemplateRef<void>>;

  constructor(
    private authorizedLayoutService: AuthorizedLayoutService,
    private authorizedLayoutNavigationService: AuthorizedLayoutNavigationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    this.authorizedLayoutNavigationService.getCurrentNavigation().pipe(
      map(Boolean),
      untilDestroyed(this),
    ).subscribe((hasNavigation) => {
      this.hasNavigation = hasNavigation;
      this.changeDetectorRef.detectChanges();
    });

    this.footerTemplate$ = this.authorizedLayoutService.getCurrentFooter().pipe(
      map((footerDef) => footerDef?.templateRef),
    );

    this.isOpenedInPopup = !isOpenedInTab();
  }
}
