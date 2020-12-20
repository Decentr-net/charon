import { PostCategory } from 'decentr-js';

export const POST_CATEGORY_TRANSLATION_MAP: Record<PostCategory, string> = {
  [PostCategory.FitnessAndExercise]: 'hub.hub_post_category.fitness_and_exercise',
  [PostCategory.HealthAndCulture]: 'hub.hub_post_category.health_and_culture',
  [PostCategory.ScienceAndTechnology]: 'hub.hub_post_category.science_and_technology',
  [PostCategory.StrangeWorld]: 'hub.hub_post_category.strange_world',
  [PostCategory.TravelAndTourism]: 'hub.hub_post_category.travel_and_tourism',
  [PostCategory.WorldNews]: 'hub.hub_post_category.world_news',
  [PostCategory.Crypto]: 'hub.hub_post_category.crypto',
};

export const POST_CATEGORIES = Object.values(PostCategory)
  .filter((value) => POST_CATEGORY_TRANSLATION_MAP[value]) as PostCategory[];
