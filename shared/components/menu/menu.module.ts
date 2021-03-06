import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { BrowserViewModule } from '../../directives/browser-view';
import { TextEllipsisModule } from '../../directives/text-ellipsis';
import { TypefaceModule } from '../../directives/typeface';
import { PdvValueModule } from '../../pipes/pdv-value';
import { SanitizeModule } from '../../pipes/sanitize';
import { AvatarModule } from '../avatar';
import { MenuComponent } from './menu';
import { MenuService } from './menu.service';

export interface MenuModuleConfig {
  service: Type<MenuService>;
}

@NgModule({
  imports: [
    AvatarModule,
    BrowserViewModule,
    CommonModule,
    MatMenuModule,
    PdvValueModule,
    SvgIconsModule,
    RouterModule,
    SanitizeModule,
    TextEllipsisModule,
    TypefaceModule,
  ],
  declarations: [
    MenuComponent
  ],
  exports: [
    MenuComponent,
  ],
})
export class MenuModule {
  public static forRoot(config: MenuModuleConfig): ModuleWithProviders<MenuModule> {
    return {
      ngModule: MenuModule,
      providers: [
        {
          provide: MenuService,
          useClass: config.service,
        },
      ],
    };
  }
}
