import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { ButtonModule } from '@shared/components/button';
import { ConfirmationDialogModule } from '@shared/components/confirmation-dialog';
import { InputCounterModule } from '@shared/components/input-counter';
import { BrowserViewModule } from '@shared/directives/browser-view';
import { TypefaceModule } from '@shared/directives/typeface';
import { BytesSizeModule } from '@shared/pipes/bytes-size';
import { PriceModule } from '@shared/pipes/price';
import { VPN_COMPONENTS } from './components';
import { VPN_PAGES } from './pages';
import { VpnRoutingModule } from './vpn-routing.module';

@NgModule({
  declarations: [
    VPN_COMPONENTS,
    VPN_PAGES,
  ],
  imports: [
    BrowserViewModule,
    ButtonModule,
    BytesSizeModule,
    CommonModule,
    ConfirmationDialogModule,
    InputCounterModule,
    MatExpansionModule,
    MatSlideToggleModule,
    NgxSkeletonLoaderModule,
    PriceModule,
    ReactiveFormsModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
    VpnRoutingModule,
  ],
})
export class VpnModule {
}
