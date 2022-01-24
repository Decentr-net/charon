import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MenuService } from '../menu.service';
import { MenuItem, MenuTranslations, MenuUserItem, MenuUserProfile } from '../menu.definitions';
import { svgDropdownExpand } from '../../../svg-icons/dropdown-expand';

@UntilDestroy()
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;

  public userProfile: MenuUserProfile;

  public translations: MenuTranslations;

  public items$: Observable<MenuItem[][]>;

  public userItem$: Observable<MenuUserItem>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private menuService: MenuService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgDropdownExpand,
    ]);
  }

  public ngOnInit(): void {
    this.menuService.getUserProfile().pipe(
      untilDestroyed(this),
    ).subscribe((userProfile) => {
      this.userProfile = userProfile;
      this.changeDetectorRef.detectChanges();
    });

    this.menuService.getTranslations().pipe(
      untilDestroyed(this),
    ).subscribe((translations) => {
      this.translations = translations;
      this.changeDetectorRef.detectChanges();
    });

    this.items$ = this.menuService.getItems();

    this.userItem$ = this.menuService.getUserItem();

    this.menuService.getCloseSource().pipe(
      untilDestroyed(this),
    ).subscribe(() => this.menuTrigger?.closeMenu());
  }
}
