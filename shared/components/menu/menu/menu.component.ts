import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { MenuService } from '../menu.service';
import { MenuItem, MenuTranslations, MenuUserItem, MenuUserProfile } from '../menu.definitions';
import { svgDropdownExpand } from '../../../svg-icons/dropdown-expand';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  public userProfile$: Observable<MenuUserProfile>;

  public translations$: Observable<MenuTranslations>;

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
    this.userProfile$ = this.menuService.getUserProfile().pipe(
      shareReplay(1),
    );

    this.translations$ = this.menuService.getTranslations().pipe(
      shareReplay(1),
    );

    this.items$ = this.menuService.getItems();

    this.userItem$ = this.menuService.getUserItem();
  }
}
