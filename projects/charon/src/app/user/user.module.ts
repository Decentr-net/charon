import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { InlineSVGModule } from 'ng-inline-svg';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { CopyWalletAddressModule } from './directives/copy-wallet-address';
import { FormErrorModule } from '@shared/components/form-error';
import { SlotModule } from '@shared/components/slot';
import { SpinnerModule } from '@shared/components/spinner';
import { LineChartModule } from '@shared/components/line-chart';
import { MatDividerModule } from '@angular/material/divider';
import { MicroValueModule } from '@shared/pipes/micro-value';
import { NavigationModule } from '@core/navigation';
import { ProfileFormModule } from '@shared/components/profile-form';
import { IntersectionModule } from '@shared/directives/intersection';
import { ToolbarStateService } from '@shared/services/toolbar-state';
import { LayoutHeaderModule } from '../layout/layout-header';
import { PdvRateMarginIconModule } from '@shared/components/pdv-rate-margin-icon/pdv-rate-margin-icon.module';
import { PdvValueModule } from '@shared/pipes/pdv-value';
import { USER_PAGES } from './pages';
import { USER_COMPONENTS } from './components';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CopyWalletAddressModule,
    FormErrorModule,
    FormsModule,
    InlineSVGModule,
    IntersectionModule,
    LayoutHeaderModule,
    LineChartModule,
    MatExpansionModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTooltipModule,
    MicroValueModule,
    NavigationModule,
    NgxSkeletonLoaderModule,
    PdvRateMarginIconModule,
    PdvValueModule,
    ProfileFormModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    SlotModule,
    SpinnerModule,
    SvgIconsModule,
    TranslocoModule,
    UserRoutingModule,
    MatDividerModule,
  ],
  declarations: [
    USER_PAGES,
    USER_COMPONENTS,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'user',
    },
    {
      provide: ToolbarStateService,
      useClass: ToolbarStateService,
    }
  ],
})
export class UserModule {
}
