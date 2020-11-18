import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';

import { CircleRoute } from '../../circle-route';

interface NewsLinkConfig {
  link: CircleRoute;
  i18nKey: string;
}

@Component({
  selector: 'app-circle-navigation',
  templateUrl: './circle-navigation.component.html',
  styleUrls: ['./circle-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleNavigationComponent {
  public readonly circleRoute: typeof CircleRoute = CircleRoute;

  public readonly newsLinksConfig: NewsLinkConfig[] = [
    {
      link: CircleRoute.World,
      i18nKey: 'world_news'
    },
    {
      link: CircleRoute.TravelAndTourism,
      i18nKey: 'travel_and_tourism'
    },
    {
      link: CircleRoute.ScienceAndTechnology,
      i18nKey: 'science_and_technology'
    },
    {
      link: CircleRoute.StrangeWorld,
      i18nKey: 'strange_world'
    },
    {
      link: CircleRoute.HealthAndCulture,
      i18nKey: 'health_and_culture'
    },
    {
      link: CircleRoute.FitnessAndExercise,
      i18nKey: 'fitness_and_exercise'
    },
  ];

  public readonly trackByLink: TrackByFunction<NewsLinkConfig> = ({}, { link }) => link;
}
