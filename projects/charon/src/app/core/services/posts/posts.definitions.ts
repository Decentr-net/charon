import { LikeWeight, Post, ProfilePDVStatisticsItem } from 'decentr-js';

import { PostOwnerProfile } from '../api';

export interface PostsListItem extends Post {
  author: PostOwnerProfile;
  likeWeight: LikeWeight;
  shareLink: string;
  stats: ProfilePDVStatisticsItem[] | null;
}
