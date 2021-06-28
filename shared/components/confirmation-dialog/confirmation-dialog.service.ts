import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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
