import { CreatePostRequest, LikeWeight, Post, Profile, ProfilePDVStatisticsItem } from 'decentr-js';

export interface PostOwnerProfile extends Profile {
  profileExists: boolean;
  postsCount: number;
}

export interface PostsListItem extends Post {
  author: PostOwnerProfile;
  likeWeight: LikeWeight;
  shareLink: string;
  stats: ProfilePDVStatisticsItem[] | null;
}

export type PostCreate = Omit<CreatePostRequest, 'owner' | 'uuid'>;
