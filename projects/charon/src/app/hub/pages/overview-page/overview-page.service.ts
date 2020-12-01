import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PostsApiService } from '@core/services/api';
import { HubPostAnalytics } from '../../components/hub-post-analytics-card';

@Injectable()
export class OverviewPageService {
  constructor(
    private postsApiService: PostsApiService,
  ) {
  }


  public getHighestPdvPosts(offsetPostAddress: number, count: number): Observable<HubPostAnalytics[]> {
    return this.postsApiService.getPosts(offsetPostAddress, count).pipe(
      map((posts) => posts.map((post) => ({ ...post, pdvIncreasePercent: 0.2 }))),
    );
  }
}
