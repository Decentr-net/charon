import { LikeWeight, Post } from 'decentr-js';

import { PostOwnerProfile } from '../api';

export interface PostsListItem extends Post {
  author: PostOwnerProfile;
  likeWeight: LikeWeight;
  stats: any;
}
