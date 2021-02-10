import { LikeWeight, Post, PublicProfile } from 'decentr-js';

export interface PostWithLike extends Post {
  likeWeight: LikeWeight;
}

export interface PostWithAuthor extends Post {
  author: PublicProfile;
  likeWeight: LikeWeight;
}
