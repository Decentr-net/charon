import { Directive, HostListener, Input } from '@angular/core';
import { Post } from 'decentr-js';
import { HubPostsService } from '../../services';

@Directive({
  selector: '[appHubDeletePost]'
})
export class HubDeletePostDirective {
  @Input('appHubDeletePost') public postId: Post['uuid'];

  constructor(
    private hubPostsService: HubPostsService,
  ) {
  }

  @HostListener('click')
  public onClick(): void {
    this.hubPostsService.deletePost(this.postId);
  }
}
