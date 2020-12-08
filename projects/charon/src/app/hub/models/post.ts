import { Post, PublicProfile } from 'decentr-js';

export interface PostWithAuthor extends Post {
  author: PublicProfile;
}
