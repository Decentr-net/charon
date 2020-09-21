import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserPageComponent } from '../../pages/user-page/user-page.component';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityDetailsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UserPageComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
