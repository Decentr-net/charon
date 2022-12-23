import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { TypefaceModule } from '../../directives/typeface';
import { ButtonModule } from '../button';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog.service';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    MatDialogModule,
    SvgIconsModule,
    TypefaceModule,
  ],
  declarations: [
    ConfirmationDialogComponent,
  ],
  providers: [
    ConfirmationDialogService,
  ],
})
export class ConfirmationDialogModule {
}
