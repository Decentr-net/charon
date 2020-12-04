import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { PostCategory } from 'decentr-js';

import { AppRoute } from '../../../app-route';
import { HubRoute } from '../../hub-route';

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

  public readonly postsLinksConfig: PostsLinkConfig[] = [
    {
      link: PostCategory.WorldNews,
      i18nKey: 'world_news'
    },
    {
      link: PostCategory.TravelAndTourism,
      i18nKey: 'travel_and_tourism'
    },
    {
      link: PostCategory.ScienceAndTechnology,
      i18nKey: 'science_and_technology'
    },
    {
      link: PostCategory.StrangeWorld,
      i18nKey: 'strange_world'
    },
    {
      link: PostCategory.HealthAndCulture,
      i18nKey: 'health_and_culture'
    },
    {
      link: PostCategory.FitnessAndExercise,
      i18nKey: 'fitness_and_exercise'
    },
  ];

  public readonly trackByLink: TrackByFunction<PostsLinkConfig> = ({}, { link }) => link;
}
