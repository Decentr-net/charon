import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LikeWeight, Post } from 'decentr-js';

import { PostWithAuthor } from '../models/post';
import { HubPostsService } from './hub-posts.service';

@Injectable()
export class HubLikesService {
  constructor(
    private hubPostsService: HubPostsService,
  ) {
  }

  public getPostChanges(postId: Post['uuid']): Observable<PostWithAuthor> {
    return this.hubPostsService.getPostChanges(postId);
  }

  public likePost(postId: Post['uuid'], likeWeight: LikeWeight): Observable<void> {
    return this.hubPostsService.likePost(postId, likeWeight);
  }
}
