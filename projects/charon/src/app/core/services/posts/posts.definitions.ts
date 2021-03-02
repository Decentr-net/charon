import { LikeWeight, Post, PublicProfile } from 'decentr-js';

export interface PostsListItem extends Post {
  author: PublicProfile;
  likeWeight: LikeWeight;
  stats: any;
}
