import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss']
})
export class ActivityDetailsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<HomeComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
