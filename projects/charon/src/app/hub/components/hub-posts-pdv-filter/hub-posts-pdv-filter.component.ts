import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HubPostsPdvFilterService, PostPdvFilter } from '../../services';

interface ButtonOption {
  id: PostPdvFilter,
  i18nKey: string,
}

@Component({
  selector: 'app-hub-posts-pdv-filter',
  templateUrl: './hub-posts-pdv-filter.component.html',
  styleUrls: ['./hub-posts-pdv-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostsPdvFilterComponent implements OnInit {
  public activeFilter$: Observable<PostPdvFilter>;

  public buttons: ButtonOption[] = [
    {
      id: PostPdvFilter.POSITIVE,
      i18nKey: 'positive',
    },
    {
      id: PostPdvFilter.POSITIVE_NEUTRAL,
      i18nKey: 'positive_neutral',
    },
    {
      id: PostPdvFilter.ALL,
      i18nKey: 'all',
    },
  ];

  constructor(
    private hubPostsPdvFilter: HubPostsPdvFilterService,
  ) {
  }

  public ngOnInit(): void {
    this.activeFilter$ = this.hubPostsPdvFilter.getFilterId();
  }

  public setFilter(button: PostPdvFilter): void {
    this.hubPostsPdvFilter.setFilterId(button);
  }
}
