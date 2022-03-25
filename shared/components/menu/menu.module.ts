import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { BrowserViewModule } from '../../directives/browser-view';
import { CurrencySymbolModule } from '@shared/components/currency-symbol';
import { TextEllipsisModule } from '../../directives/text-ellipsis';
import { TypefaceModule } from '../../directives/typeface';
import { PdvValueModule } from '../../pipes/pdv-value';
import { AvatarModule } from '../avatar';
import { MenuComponent } from './menu';
import { MenuService } from './menu.service';
import { MicroValueModule } from '@shared/pipes/micro-value';
import { NumberFormatModule } from '@shared/pipes/number-format';

export interface MenuModuleConfig {
  service: Type<MenuService>;
}

@NgModule({
  imports: [
    AvatarModule,
    BrowserViewModule,
    CommonModule,
    CurrencySymbolModule,
    MatMenuModule,
    MicroValueModule,
    NgxSkeletonLoaderModule,
    NumberFormatModule,
    PdvValueModule,
    SvgIconsModule,
    RouterModule,
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
