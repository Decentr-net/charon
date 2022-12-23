import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogConfig } from './confirmation-dialog.definitions';

@Injectable()
export class ConfirmationDialogService {
  constructor(
    private matDialog: MatDialog,
  ) {
  }

  public open(config: ConfirmationDialogConfig): MatDialogRef<ConfirmationDialogComponent, boolean> {
    return this.matDialog.open(
      ConfirmationDialogComponent,
      {
        data: config,
        panelClass: 'app-confirmation-dialog-container',
      },
    );
  }
}
