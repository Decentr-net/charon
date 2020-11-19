import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PostsApiService } from '@core/services/api';

@Injectable()
export class RecentPageService {
  constructor(
    private postsApiService: PostsApiService,
  ) {
  }


  public getPosts(offsetPostAddress: number, count: number): Observable<any> {
    return this.postsApiService.getPosts(offsetPostAddress, count);
  }
}
