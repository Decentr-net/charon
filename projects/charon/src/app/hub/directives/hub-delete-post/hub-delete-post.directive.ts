import { Directive, HostListener, Input } from '@angular/core';
import { Post } from 'decentr-js';

import { HubDeletePostDialogComponent } from './hub-delete-post-dialog.component';
import { HubPostsService } from '../../services';
import { MatDialog } from '@angular/material/dialog';

@Directive({
  selector: '[appHubDeletePost]'
})
export class HubDeletePostDirective {
  @Input('appHubDeletePost') public post: Post;

  constructor(
    private hubPostsService: HubPostsService,
    public dialog: MatDialog,
  ) {
  }

  @HostListener('click')
  public onClick(): void {
    const dialogRef = this.dialog.open(HubDeletePostDialogComponent);

    dialogRef.afterClosed().subscribe((dialog) => {
      if (dialog) {
        this.hubPostsService.deletePost(this.post);
      }
    });
  }
}
