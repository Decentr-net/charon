import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { PostWithAuthor } from '../../models/post';
import { PostPageService } from './post-page.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PostPageService,
  ],
})
export class PostPageComponent implements OnInit {
  public post$: Observable<PostWithAuthor>;

  constructor(
    private postPageService: PostPageService,
  ) {
  }

  public ngOnInit(): void {
    this.post$ = this.postPageService.getPost();

    this.post$.subscribe(console.log);
  }
}
