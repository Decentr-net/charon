import { LikeWeight, Post, PostCategory, PublicProfile, Wallet } from 'decentr-js';

export interface PostsListFilterOptions {
  after?: string;  // `Post['owner']/Post['uuid']`
  category?: PostCategory;
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

export interface PostResponse {
  post: PostsListResponsePost;
  profile: PublicProfile;
  stats: Record<string, PostsListResponseStat>;
}

type PostsListResponseStat = Record<string, number>;

export interface PostsListResponse {
  posts: PostsListResponsePost[];
  profiles: Record<Post['owner'], PublicProfile>;
  stats: Record<string, PostsListResponseStat>; // [`owner/uuid`]: PostsListResponseStat
}
