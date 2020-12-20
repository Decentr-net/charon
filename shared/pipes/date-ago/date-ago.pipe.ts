import { ChangeDetectorRef, NgZone, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, of, Subscription, timer } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

@Pipe({
  name: 'dateAgo',
  pure: false,
})
export class DateAgoPipe implements PipeTransform, OnDestroy {
  private ngZone$: Subscription = Subscription.EMPTY;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private translocoService: TranslocoService,
    private ngZone: NgZone,
  ) {
  }

  transform(value: string | number): Observable<string> {
    const date = new Date(Number(value));
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - date.getTime()) / 1000));
    const timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000;

    const minutes = Math.round(Math.abs(seconds / 60));
    const hours = Math.round(Math.abs(minutes / 60));
    const days = Math.round(Math.abs(hours / 24));
    const months = Math.round(Math.abs(days / 30.416));
    const years = Math.round(Math.abs(days / 365));

    let params: {
      translateKey: string;
      value?: number;
    };

    this.ngZone$ = this.ngZone.runOutsideAngular(() => {
      if (typeof window === 'undefined') {
        return null;
      }

      return this.ngZone$ = timer(timeToUpdate).pipe(
        map(() => this.ngZone.run(() => this.changeDetectorRef.markForCheck()))
      ).subscribe();
    });

    if (Number.isNaN(seconds)) {
      return of('');
    } else if (seconds <= 45) {
      params = { translateKey: 'second' };
    } else if (seconds <= 90) {
      params = { translateKey: 'minute' };
    } else if (minutes <= 45) {
      params = { translateKey: 'minutes', value: minutes };
    } else if (minutes <= 90) {
      params = { translateKey: 'hour' };
    } else if (hours <= 22) {
      params = { translateKey: 'hours', value: hours };
    } else if (hours <= 36) {
      params = { translateKey: 'day' };
    } else if (days <= 25) {
      params = { translateKey: 'days', value: days };
    } else if (days <= 45) {
      params = { translateKey: 'month' };
    } else if (days <= 345) {
      params = { translateKey: 'months', value: months };
    } else if (days <= 545) {
      params = { translateKey: 'year' };
    } else {
      params = { translateKey: 'years', value: years };
    }

    return this.translocoService.selectTranslate<string>(
      `date_ago.${params.translateKey}`,
      null,
      'core',
    ).pipe(
      map((translate) => params.value
        ? `${params.value} ${translate}`
        : translate
      ),
    );
  }

  ngOnDestroy(): void {
    this.removeTimer();
  }

  private getSecondsUntilUpdate(seconds: number): number {
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;

    if (seconds < minute) {
      return 2; // less than 1 minute, update every 2 seconds
    } else if (seconds < hour) {
      return 30; // less than an hour, update every 30 seconds
    } else if (seconds < day) {
      return 300; // less then a day, update every 5 minutes
    } else {
      return 3600; // update every hour
    }
  }

  private removeTimer(): void {
    this.ngZone$.unsubscribe();
  }
}
