import { PostCategory } from 'decentr-js';

export const POST_CATEGORIES = Object.values(PostCategory)
  .filter((value) => !isNaN(+value) && +value > 0) as PostCategory[];

export const POST_CATEGORY_TRANSLATION_MAP = POST_CATEGORIES
  .reduce((acc, postCategory) => ({
    ...acc,
    [postCategory]: `hub.hub_post_category.${postCategory}`,
  }), {}) as Record<PostCategory, string>;
