import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { AuthorizedLayoutNavigationLinkDefDirective } from '../authorized-layout-navigation-link';
import { AuthorizedLayoutNavigationService } from './authorized-layout-navigation.service';

@Directive({
  selector: '[appAuthorizedLayoutNavigationDef]',
})
export class AuthorizedLayoutNavigationDefDirective implements OnInit, OnDestroy {
  private linksDefs: BehaviorSubject<AuthorizedLayoutNavigationLinkDefDirective[]> = new BehaviorSubject([]);

  constructor(
    private authorizedLayoutService: AuthorizedLayoutNavigationService,
    public templateRef: TemplateRef<void>,
    private viewContainerRef: ViewContainerRef,
  ) {
  }

  public ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.templateRef);
    this.authorizedLayoutService.registerNavigation(this);
  }

  public ngOnDestroy(): void {
    this.authorizedLayoutService.unregisterNavigation(this);
  }

  public getLinksDefs(): Observable<AuthorizedLayoutNavigationLinkDefDirective[]> {
    return this.linksDefs.asObservable().pipe(
      debounceTime(0),
    );
  }

  public registerLinkDef(linkDef: AuthorizedLayoutNavigationLinkDefDirective): void {
    this.unregisterLinkDef(linkDef);

    this.linksDefs.next([...this.linksDefs.value, linkDef]);
  }

  public unregisterLinkDef(linkDef: AuthorizedLayoutNavigationLinkDefDirective): void {
    this.linksDefs.next(this.linksDefs.value.filter((item) => item !== linkDef));
  }
}
