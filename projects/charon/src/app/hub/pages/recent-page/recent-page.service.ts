import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from 'decentr-js';

@Injectable()
export class RecentPageService {

  public getPosts(offsetPostAddress: number, count: number): Observable<Post[]> {
    return of([]);
  }
}
