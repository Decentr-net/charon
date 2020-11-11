import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PDVData } from 'decentr-js';

export interface PDVDetailsDialogData {
  date: Date;
  domain: string;
  ip: string;
  userAgent: string;
  pdvData: PDVData[];
}

@Component({
  selector: 'app-pdv-details',
  templateUrl: './pdv-details-dialog.component.html',
  styleUrls: ['./pdv-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdvDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public details: PDVDetailsDialogData,
  ) {
  }
}
