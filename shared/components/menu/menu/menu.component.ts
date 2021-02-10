import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { MenuService } from '../menu.service';
import { MenuLink, MenuTranslations, MenuUserLink, MenuUserProfile } from '../menu.definitions';
import { svgDropdownExpand } from '../../../svg-icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  @Input() hideUsername: boolean;

  public userProfile$: Observable<MenuUserProfile>;

  public translations$: Observable<MenuTranslations>;

  public links$: Observable<MenuLink[]>;

  public userLink$: Observable<MenuUserLink>;

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

    this.links$ = this.menuService.getLinks();

    this.userLink$ = this.menuService.getUserLink();
  }

  public lock(): void {
    this.menuService.lock();
  }
}
