import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Post } from 'decentr-js';

import { HubPostDialogComponent } from '../../components/hub-post-dialog';
import { HubPostsService } from '../../services';
import { PostWithAuthor } from '../../models/post';

@Directive({
  selector: '[appHubPostDialog]'
})
export class HubPostDialogDirective implements OnInit, OnDestroy {
  @Input('appHubPostDialog') public postId: Post['uuid'];

  private dialogRef: MatDialogRef<HubPostDialogComponent>;

  constructor(
    private hubPostsService: HubPostsService,
    private elementRef: ElementRef,
    private matDialog: MatDialog,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
  ) {
  }

  public ngOnInit() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('click')
  public onClick(): void {
    const config: MatDialogConfig<Observable<PostWithAuthor>> = {
      width: '80vw',
      maxWidth: '100%',
      height: '80vh',
      maxHeight: '100%',
      panelClass: 'popup-no-padding',
      data: this.getPostWithAuthorChanges(this.postId),
      viewContainerRef: this.viewContainerRef,
    };

    this.dialogRef = this.matDialog.open(HubPostDialogComponent, config);
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  private getPostWithAuthorChanges(postId: Post['uuid']): Observable<PostWithAuthor> {
    return this.hubPostsService.getPostChanges(postId).pipe(
      switchMap((post) => this.hubPostsService.getPublicProfile(post.owner).pipe(
        map((author) => ({ ...post, author })),
      )),
    );
  }
}
