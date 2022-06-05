import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { VPN_COMPONENTS } from './components';
import { VPN_PAGES } from './pages';
import { ButtonModule } from '@shared/components/button';
import { BytesSizeModule } from '@shared/pipes/bytes-size';
import { InputCounterModule } from '@shared/components/input-counter';
import { OverlayModule } from '@angular/cdk/overlay';
import { PriceModule } from '@shared/pipes/price';
import { TypefaceModule } from '@shared/directives/typeface';
import { VpnRoutingModule } from './vpn-routing.module';

@NgModule({
  declarations: [
    VPN_COMPONENTS,
    VPN_PAGES,
  ],
  imports: [
    ButtonModule,
    BytesSizeModule,
    CommonModule,
    InputCounterModule,
    MatExpansionModule,
    MatSlideToggleModule,
    NgxSkeletonLoaderModule,
    OverlayModule,
    PriceModule,
    SvgIconsModule,
    ReactiveFormsModule,
    TranslocoModule,
    TypefaceModule,
    VpnRoutingModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'vpn',
    },
  ],
})
export class VpnModule {
}
