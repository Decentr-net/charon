import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { ButtonModule } from '@shared/components/button';
import { ButtonBackModule } from '@shared/components/button-back';
import { InputModule } from '@shared/components/controls';
import { CurrencySymbolModule } from '@shared/components/currency-symbol';
import { ExpansionListModule } from '@shared/components/expansion-list';
import { BindQueryParamsModule } from '@shared/directives/bind-query-params';
import { FormErrorModule } from '@shared/components/form-error';
import { BrowserViewModule } from '@shared/directives/browser-view';
import { IntersectionModule } from '@shared/directives/intersection';
import { SubmitAfterValidationModule } from '@shared/directives/submit-after-validation';
import { TextEllipsisModule } from '@shared/directives/text-ellipsis';
import { TypefaceModule } from '@shared/directives/typeface';
import { MicroValueModule } from '@shared/pipes/micro-value';
import { NumberFormatModule } from '@shared/pipes/number-format';
import { NavigationModule } from '@core/navigation';
import { ASSETS_COMPONENTS } from './components';
import { ASSETS_PAGES } from './pages';
import { ASSETS_DIRECTIVES } from './directives';
import { AssetsRoutingModule } from './assets-routing.module';

@NgModule({
  declarations: [
    ASSETS_COMPONENTS,
    ASSETS_DIRECTIVES,
    ASSETS_PAGES,
  ],
  imports: [
    AssetsRoutingModule,
    BindQueryParamsModule,
    BrowserViewModule,
    ButtonBackModule,
    ButtonModule,
    ClipboardModule,
    CommonModule,
    CurrencySymbolModule,
    ExpansionListModule,
    FormErrorModule,
    InputModule,
    IntersectionModule,
    MicroValueModule,
    NavigationModule,
    NgxSkeletonLoaderModule,
    NumberFormatModule,
    ReactiveFormsModule,
    SubmitAfterValidationModule,
    SvgIconsModule,
    TextEllipsisModule,
    TranslocoModule,
    TypefaceModule,
  ],
})
export class AssetsModule {
}
