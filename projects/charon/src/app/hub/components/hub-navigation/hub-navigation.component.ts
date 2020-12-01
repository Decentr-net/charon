import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';

import { HubRoute } from '../../hub-route';

interface NewsLinkConfig {
  link: HubRoute;
  i18nKey: string;
}

@Component({
  selector: 'app-hub-navigation',
  templateUrl: './hub-navigation.component.html',
  styleUrls: ['./hub-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubNavigationComponent {
  public readonly hubRoute: typeof HubRoute = HubRoute;

  public readonly newsLinksConfig: NewsLinkConfig[] = [
    {
      link: HubRoute.World,
      i18nKey: 'world_news'
    },
    {
      link: HubRoute.TravelAndTourism,
      i18nKey: 'travel_and_tourism'
    },
    {
      link: HubRoute.ScienceAndTechnology,
      i18nKey: 'science_and_technology'
    },
    {
      link: HubRoute.StrangeWorld,
      i18nKey: 'strange_world'
    },
    {
      link: HubRoute.HealthAndCulture,
      i18nKey: 'health_and_culture'
    },
    {
      link: HubRoute.FitnessAndExercise,
      i18nKey: 'fitness_and_exercise'
    },
  ];

  public readonly trackByLink: TrackByFunction<NewsLinkConfig> = ({}, { link }) => link;
}
