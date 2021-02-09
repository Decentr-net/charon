import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { PostCategory } from 'decentr-js';

import { AppRoute } from '../../../app-route';
import { POST_CATEGORIES, POST_CATEGORY_TRANSLATION_MAP } from '../../models/post-category';
import { HubRoute } from '../../hub-route';

interface PostsLinkConfig {
  id: PostCategory;
  i18nKey: string;
}

@Component({
  selector: 'app-hub-navigation',
  templateUrl: './hub-navigation.component.html',
  styleUrls: ['./hub-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubNavigationComponent {
  public readonly appRoute: typeof AppRoute = AppRoute;
  public readonly hubRoute: typeof HubRoute = HubRoute;

  public readonly postsLinksConfig: PostsLinkConfig[] = POST_CATEGORIES.map((category) => ({
    id: category,
    i18nKey: POST_CATEGORY_TRANSLATION_MAP[category]
  }));

  public readonly trackByLink: TrackByFunction<PostsLinkConfig> = ({}, { id }) => id;
}
