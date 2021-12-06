import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { AnalyticsModule } from '../../analytics';
import { TypefaceModule } from '../../directives/typeface';
import { ButtonModule } from '../button';
import { SeedComponent } from './seed.component';

@NgModule({
  imports: [
    AnalyticsModule,
    ButtonModule,
    ClipboardModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
  ],
  declarations: [
    SeedComponent,
  ],
  exports: [
    SeedComponent,
  ],
})
export class SeedModule {
}
