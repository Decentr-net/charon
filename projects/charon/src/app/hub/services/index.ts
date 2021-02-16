import { HubCreatePostService } from './hub-create-post.service';
import { HubDashboardService } from './hub-dashboard.service';

export * from './hub-likes.service';
export * from './hub-posts.service';
export * from './hub-create-post.service';

export const HUB_SERVICES = [
  HubCreatePostService,
  HubDashboardService,
];
