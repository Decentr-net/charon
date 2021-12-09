import { LikeWeight, Post } from 'decentr-js';

import { PDVStats } from '@shared/services/pdv';
import { PostOwnerProfile } from '../api';

export interface PostsListItem extends Post {
  author: PostOwnerProfile;
  likeWeight: LikeWeight;
  shareLink: string;
  stats: PDVStats[] | null;
}
