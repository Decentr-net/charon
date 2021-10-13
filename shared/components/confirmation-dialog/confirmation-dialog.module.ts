import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { AutomationModule } from '../../directives/automation';
import { TypefaceModule } from '../../directives/typeface';
import { ButtonModule } from '../button';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog.service';

@NgModule({
  imports: [
    AutomationModule,
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
