import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { ButtonModule } from '@shared/components/button';
import { SeedComponent } from '@shared/components/seed/seed.component';
import { TypefaceModule } from '@shared/directives/typeface';

@NgModule({
  imports: [
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
