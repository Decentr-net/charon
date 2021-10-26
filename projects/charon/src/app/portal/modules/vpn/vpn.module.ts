import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';

import { SpinnerModule } from '@shared/components/spinner';
import { TypefaceModule } from '@shared/directives/typeface';
import { VPN_COMPONENTS } from './components';
import { VPN_PAGES } from './pages';
import { VpnRoutingModule } from './vpn-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VPN_COMPONENTS,
    VPN_PAGES,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    ReactiveFormsModule,
    SpinnerModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
    VpnRoutingModule,
  ],
})
export class VpnModule {
}
