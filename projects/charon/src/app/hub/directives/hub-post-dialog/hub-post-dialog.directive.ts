import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Post } from 'decentr-js';

import { HubPostDialogComponent } from '../../components/hub-post-dialog';

@Directive({
  selector: '[appHubPostDialog]'
})
export class HubPostDialogDirective implements OnInit {
  @Input('appHubPostDialog') public post: Post;

  constructor(
    private elementRef: ElementRef,
    private matDialog: MatDialog,
    private renderer: Renderer2,
  ) {
  }

  public ngOnInit() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('click')
  public onClick(): void {
    const config: MatDialogConfig<Post> = {
      width: '830px',
      maxWidth: '100%',
      maxHeight: '700px',
      panelClass: 'popup-no-padding',
      data: this.post,
    };

    this.matDialog.open(HubPostDialogComponent, config);
  }
}
