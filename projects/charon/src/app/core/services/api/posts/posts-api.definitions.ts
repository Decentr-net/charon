import { LikeWeight, Post, PostCategory, Profile, Wallet } from 'decentr-js';

export interface PostsListFilterOptions {
  after?: string;  // `Post['owner']/Post['uuid']`
  category?: PostCategory;
  followedBy?: Post['owner'];
  from?: Post['createdAt'];
  likedBy?: Post['owner'];
  limit?: number;
  orderBy?: 'asc' | 'desc';
  owner?: Post['owner'];
  requestedBy?: Wallet['address'];
  sortBy?: 'createdAt' | 'likesCount' | 'dislikesCount' | 'pdv';
  to?: Post['createdAt'];
}

export interface PostsListResponsePost extends Post {
  likeWeight: LikeWeight;
}

export interface PostOwnerProfile extends Profile {
  postsCount: number;
}

export interface PostResponse {
  post: PostsListResponsePost;
  profile: PostOwnerProfile;
  stats: PostsListResponseStat[];
}

export interface PostsListResponseStat {
  date: string;
  value: Post['pdv'];
}

export interface PostsListResponse {
  posts: PostsListResponsePost[];
  profiles: Record<Post['owner'], PostOwnerProfile>;
  stats: Record<string, PostsListResponseStat[]>; // [`owner/uuid`]: PostsListResponseStat
}
