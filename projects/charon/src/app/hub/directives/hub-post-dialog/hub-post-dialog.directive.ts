import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { HubPostDialogComponent } from '../../components/hub-post-dialog';
import { Post } from '../../models/post';

@Directive({
  selector: '[appHubPostDialog]'
})
export class HubPostDialogDirective {
  @Input('appHubPostDialog') public post: Post;

  constructor(private matDialog: MatDialog) {
  }

  @HostListener('click')
  public onClick(): void {
    const config: MatDialogConfig<Post> = {
      width: '600px',
      maxWidth: '100%',
      maxHeight: '700px',
      panelClass: 'popup-no-padding',
      data: this.post,
    };

    this.matDialog.open(HubPostDialogComponent, config);
  }
}
