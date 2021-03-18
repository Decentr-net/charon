import { LikeWeight, Post } from 'decentr-js';

import { PostOwnerProfile } from '../api';

export interface PostsListItemStat {
  date: string;
  value: Post['pdv'];
}

export interface PostsListItem extends Post {
  author: PostOwnerProfile;
  likeWeight: LikeWeight;
  stats: PostsListItemStat[] | null;
}
