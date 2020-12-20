import { ChangeDetectorRef, NgZone, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'dateAgo',
  pure: false,
})
export class DateAgoPipe implements PipeTransform, OnDestroy {
  private ngZone$: Subscription = Subscription.EMPTY;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {
  }

  transform(value: string | number): string {
    const date = new Date(Number(value));
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - date.getTime()) / 1000));
    const timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000;

    this.ngZone$ = this.ngZone.runOutsideAngular(() => {
      console.log('pipe');
      if (typeof window === 'undefined') {
        return null;
      }

      return this.ngZone$ = timer(timeToUpdate).pipe(
        map(() => this.ngZone.run(() => this.changeDetectorRef.markForCheck()))
      ).subscribe();
    });

    const minutes = Math.round(Math.abs(seconds / 60));
    const hours = Math.round(Math.abs(minutes / 60));
    const days = Math.round(Math.abs(hours / 24));
    const months = Math.round(Math.abs(days / 30.416));
    const years = Math.round(Math.abs(days / 365));

    if (Number.isNaN(seconds)) {
      return '';
    } else if (seconds <= 45) {
      return 'a few seconds ago';
    } else if (seconds <= 90) {
      return 'a minute ago';
    } else if (minutes <= 45) {
      return minutes + ' minutes ago';
    } else if (minutes <= 90) {
      return 'an hour ago';
    } else if (hours <= 22) {
      return hours + ' hours ago';
    } else if (hours <= 36) {
      return 'a day ago';
    } else if (days <= 25) {
      return days + ' days ago';
    } else if (days <= 45) {
      return 'a month ago';
    } else if (days <= 345) {
      return months + ' months ago';
    } else if (days <= 545) {
      return 'a year ago';
    } else {
      // will return string for (days > 545)
      return years + ' years ago';
    }
  }

  ngOnDestroy(): void {
    this.removeTimer();
  }

  private getSecondsUntilUpdate(seconds: number): number {
    const min = 60;
    const hr = min * 60;
    const day = hr * 24;

    if (seconds < min) {
      // less than 1 min, update every 2 secs
      return 2;
    } else if (seconds < hr) {
      // less than an hour, update every 30 secs
      return 30;
    } else if (seconds < day) {
      // less then a day, update every 5 mins
      return 300;
    } else {
      // update every hour
      return 3600;
    }
  }

  private removeTimer(): void {
    this.ngZone$.unsubscribe();
  }
}
