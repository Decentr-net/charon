import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { MenuService } from '../menu.service';
import { MenuLink, MenuTranslations, MenuUserLink, MenuUserProfile } from '../menu.definitions';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  public userProfile$: Observable<MenuUserProfile>;

  public translations$: Observable<MenuTranslations>;

  public links$: Observable<MenuLink[]>;

  public userLink$: Observable<MenuUserLink>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private menuService: MenuService,
  ) {
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
