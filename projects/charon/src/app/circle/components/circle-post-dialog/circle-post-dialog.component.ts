import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Post } from '../../models/post';

@Component({
  selector: 'app-circle-post-dialog',
  templateUrl: './circle-post-dialog.component.html',
  styleUrls: ['./circle-post-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePostDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public post: Post) {
  }
}
