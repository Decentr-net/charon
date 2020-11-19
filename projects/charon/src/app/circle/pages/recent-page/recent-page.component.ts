import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { RecentPageService } from './recent-page.service';
import { catchError, finalize } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-recent-page',
  templateUrl: './recent-page.component.html',
  styleUrls: ['./recent-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    RecentPageService,
  ],
})
export class RecentPageComponent implements OnInit {
  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public readonly posts$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public readonly loadingCount = 4;

  constructor(
    private recentPageService: RecentPageService,
  ) {
  }

  private get posts(): any[] {
    return this.posts$.value;
  }

  public ngOnInit() {
    this.loadMore();
  }

  public loadMore(): void {
    this.isLoading$.next(true);

    const lastPostAddress = this.posts.length
      ? this.posts[this.posts.length - 1].address
      : 0;

    this.recentPageService.getPosts(lastPostAddress, this.loadingCount)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.isLoading$.next(false)),
        untilDestroyed(this),
      )
      .subscribe((posts) => {
        this.posts$.next([...this.posts$.value, ...posts]);
      });
  }

  public trackByPostAddress: TrackByFunction<any> = ({}, { address }) => address;
}
