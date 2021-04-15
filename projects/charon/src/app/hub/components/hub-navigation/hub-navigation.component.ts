import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppRoute } from '../../../app-route';
import { POST_CATEGORIES, POST_CATEGORY_TRANSLATION_MAP } from '../../models/post-category';
import { HubPostCategoryColorDirective } from '../../directives/hub-post-category-color';
import { HubRoute } from '../../hub-route';

interface LinkDef {
  colorClass: string;
  dot: boolean;
  link: string[];
  i18nKey: string;
}

@Component({
  selector: 'app-hub-navigation',
  templateUrl: './hub-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubNavigationComponent {

  public readonly links: LinkDef[] = [
    {
      colorClass: 'color-primary',
      dot: false,
      i18nKey: 'hub.hub_navigation.latest_posts',
      link: ['/', AppRoute.Hub, HubRoute.Posts],
    },
    ...POST_CATEGORIES.map((category) => ({
      colorClass: HubPostCategoryColorDirective.getColorClass(category),
      dot: true,
      i18nKey: POST_CATEGORY_TRANSLATION_MAP[category],
      link: ['/', AppRoute.Hub, HubRoute.Posts, category.toString()],
    })),
  ];
}
