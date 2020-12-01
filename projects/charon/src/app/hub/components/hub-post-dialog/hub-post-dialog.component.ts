import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Post } from '../../models/post';

@Component({
  selector: 'app-hub-post-dialog',
  templateUrl: './hub-post-dialog.component.html',
  styleUrls: ['./hub-post-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public post: Post) {
  }
}
