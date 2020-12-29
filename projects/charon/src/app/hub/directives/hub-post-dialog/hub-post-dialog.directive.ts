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
      width: '830px',
      maxWidth: '100%',
      maxHeight: '700px',
      panelClass: 'popup-no-padding',
      data: this.hubPostsService.getPostChanges(this.postId),
      viewContainerRef: this.viewContainerRef,
    };

    this.dialogRef = this.matDialog.open(HubPostDialogComponent, config);
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
