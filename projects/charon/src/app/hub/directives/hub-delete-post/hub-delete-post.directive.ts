import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, mergeMap } from 'rxjs/operators';
import { Post } from 'decentr-js';

import { HubDeletePostDialogComponent } from '../../components/hub-delete-post-dialog';
import { HubPostsService } from '../../services';

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

  @HostListener('click', ['$event'])
  public onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const dialogRef = this.dialog.open(HubDeletePostDialogComponent);

    dialogRef.afterClosed().pipe(
      filter((isConfirmed) => isConfirmed),
      mergeMap(() => this.hubPostsService.deletePost(this.post)),
    ).subscribe();
  }
}
