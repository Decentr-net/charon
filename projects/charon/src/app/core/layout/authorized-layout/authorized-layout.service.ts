import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthorizedLayoutFooterDefDirective } from './authorized-layout-footer';

@Injectable()
export class AuthorizedLayoutService {
  private readonly footer: BehaviorSubject<AuthorizedLayoutFooterDefDirective[]> = new BehaviorSubject([]);

  public getCurrentFooter(): Observable<AuthorizedLayoutFooterDefDirective | undefined> {
    return this.footer.pipe(
      map((footer) => footer[footer.length - 1]),
    );
  }

  public registerFooter(navigation: AuthorizedLayoutFooterDefDirective): void {
    this.unregisterFooter(navigation);

    this.footer.next([...this.footer.value, navigation]);
  }

  public unregisterFooter(footer: AuthorizedLayoutFooterDefDirective): void {
    this.footer.next(this.footer.value.filter((item) => item !== footer));
  }
}
