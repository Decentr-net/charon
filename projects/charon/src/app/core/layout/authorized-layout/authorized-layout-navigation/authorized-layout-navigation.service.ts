import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthorizedLayoutNavigationDefDirective } from './authorized-layout-navigation-def.directive';
import { AuthorizedLayoutNavigationContentDefDirective } from '@core/layout/authorized-layout/authorized-layout-navigation/authorized-layout-navigation-content-def.directive';

@Injectable()
export class AuthorizedLayoutNavigationService {
  private readonly navigation: BehaviorSubject<AuthorizedLayoutNavigationDefDirective[]> = new BehaviorSubject([]);

  private readonly content: BehaviorSubject<AuthorizedLayoutNavigationContentDefDirective[]>
    = new BehaviorSubject([]);

  public getCurrentNavigation(): Observable<AuthorizedLayoutNavigationDefDirective | undefined> {
    return this.navigation.pipe(
      map((navigation) => navigation[navigation.length - 1]),
    );
  }

  public registerNavigation(navigation: AuthorizedLayoutNavigationDefDirective): void {
    this.unregisterNavigation(navigation);

    this.navigation.next([...this.navigation.value, navigation]);
  }

  public unregisterNavigation(navigation: AuthorizedLayoutNavigationDefDirective): void {
    this.navigation.next(this.navigation.value.filter((item) => item !== navigation));
  }

  public getCurrentContent(): Observable<AuthorizedLayoutNavigationContentDefDirective | undefined> {
    return this.content.pipe(
      map((navigation) => navigation[navigation.length - 1]),
    );
  }

  public registerContent(content: AuthorizedLayoutNavigationContentDefDirective): void {
    this.unregisterContent(content);

    this.content.next([...this.content.value, content]);
  }

  public unregisterContent(content: AuthorizedLayoutNavigationContentDefDirective): void {
    this.content.next(this.content.value.filter((item) => item !== content));
  }
}
