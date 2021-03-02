import { Post, PostCategory, PublicProfile } from 'decentr-js';

export interface PostsListFilterOptions {
  after?: string;  // `Post['owner']/Post['uuid']`
  category?: PostCategory;
  from?: Post['createdAt'];
  liked_by?: Post['owner'];
  limit?: number;
  order_by?: 'asc' | 'desc';
  owner?: Post['owner'];
  sort_by?: 'created_at' | 'likes' | 'dislikes' | 'pdv';
  to?: Post['createdAt'];
}

export interface PostsListResponsePost extends Omit<Post, 'createdAt' | 'dislikesCount' | 'likesCount' | 'previewImage'> {
  created_at: Post['createdAt'];
  dislikes: Post['dislikesCount'];
  likes: Post['likesCount'];
  preview_image: Post['previewImage'];
}

interface PostsListResponseProfile extends Omit<PublicProfile, 'firstName' | 'lastName'> {
  first_name: PublicProfile['firstName'];
  last_name: PublicProfile['lastName'];
}

type PostsListResponseStat = any;

export interface PostsListResponse {
  posts: PostsListResponsePost[];
  profiles: Record<Post['owner'], PostsListResponseProfile>;
  stats: Record<string, PostsListResponseStat>; // [`owner/uuid`]: PostsListResponseStat
}
