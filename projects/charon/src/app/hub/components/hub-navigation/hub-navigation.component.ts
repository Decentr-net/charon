import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { PostCategory } from 'decentr-js';

import { AppRoute } from '../../../app-route';
import { HubRoute } from '../../hub-route';
import { POST_CATEGORIES, POST_CATEGORY_TRANSLATION_MAP } from '../../models/post-category-translation-map';

interface PostsLinkConfig {
  link: PostCategory;
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
    link: category,
    i18nKey: POST_CATEGORY_TRANSLATION_MAP[category]
  }));

  public readonly trackByLink: TrackByFunction<PostsLinkConfig> = ({}, { link }) => link;
}
