import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class PostsApiService {
  private post = {
    author: {
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Square_-_black_simple.svg/1200px-Square_-_black_simple.svg.png',
      name: 'Eugene Tishkevich',
    },
    content: 'Grocery delivery is one of the fastest growing businesses at Amazon and we think this will be one of the most-loved Prime benefits in the UK, says Russell Jones, country manager of Amazon Fresh UK.\n' +
      'He says this expansion was on the cards before Covid-19.',
    pdv: 1.78,
    rating: {
      likes: 2,
      dislikes: 1,
    },
    time: Date.now(),
    title: 'Why is grocery shopping a Covid-19 issue',
  };

  private posts = new Array(1000).fill(0).map(({}, index) => ({
    address: index + 1,
    ...this.post,
  }));

  public getPosts(offsetPostAddress: number, count: number): Observable<any> {
    const offsetPostIndex = this.posts.findIndex((post) => post.address === offsetPostAddress);
    const startPostIndex = offsetPostIndex + 1;

    return of(this.posts.slice(startPostIndex, startPostIndex + count))
      .pipe(
        delay(2000),
      );
  }
}
