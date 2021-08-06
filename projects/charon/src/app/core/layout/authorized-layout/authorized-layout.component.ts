import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewChild,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { isOpenedInTab } from '@shared/utils/browser';
import { AuthorizedLayoutNavigationService } from './authorized-layout-navigation';

export const AUTHORIZED_LAYOUT_FOOTER_SLOT = Symbol('AUTHORIZED_LAYOUT_FOOTER_SLOT');

@UntilDestroy()
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
  @ViewChild('contentContainer', { static: true }) public contentContainer: ElementRef<HTMLDivElement>;

  @HostBinding('class.mod-popup-view') public isOpenedInPopup: boolean;

  public readonly footerSlotName: Symbol = AUTHORIZED_LAYOUT_FOOTER_SLOT;

  public hasNavigation: boolean;

  constructor(
    private authorizedLayoutNavigationService: AuthorizedLayoutNavigationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    console.log(this.contentContainer);
    this.authorizedLayoutNavigationService.getCurrentNavigation().pipe(
      map(Boolean),
      untilDestroyed(this),
    ).subscribe((hasNavigation) => {
      this.hasNavigation = hasNavigation;
      this.changeDetectorRef.markForCheck();
    });

    this.isOpenedInPopup = !isOpenedInTab();
  }

  public scrollToTop(): void {
    this.contentContainer.nativeElement.scrollTop = 0;
  }
}
