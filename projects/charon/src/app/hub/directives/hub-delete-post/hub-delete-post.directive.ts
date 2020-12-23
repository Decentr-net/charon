import { Directive, HostListener, Input } from '@angular/core';
import { Post } from 'decentr-js';

import { HubDeletePostDialogComponent } from '../../components/hub-delete-post-dialog';
import { HubPostsService } from '../../services';
import { MatDialog } from '@angular/material/dialog';

@Directive({
  selector: '[appHubDeletePost]'
})
export class HubDeletePostDirective {
  @Input('appHubDeletePost') public post: Post;

  constructor(
    private dialog: MatDialog,
    private hubPostsService: HubPostsService,
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
