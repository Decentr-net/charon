import { Directive, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';

import { AuthorizedLayoutNavigationDefDirective } from '../authorized-layout-navigation';

@Directive({
  selector: '[appAuthorizedLayoutNavigationLinkDef]',
})
export class AuthorizedLayoutNavigationLinkDefDirective implements OnInit, OnDestroy {
  @Input('appAuthorizedLayoutNavigationLinkDef') public link: string | string[];

  @Input('appAuthorizedLayoutNavigationLinkDefDot') public dot: boolean = false;

  @Input('appAuthorizedLayoutNavigationLinkDefColorClass') public colorClass: string = '';

  @Input('appAuthorizedLayoutNavigationLinkDefExact') public exact: boolean = true;

  constructor(
    private navigationDef: AuthorizedLayoutNavigationDefDirective,
    public templateRef: TemplateRef<void>,
  ) {
  }

  public ngOnInit(): void {
    this.navigationDef.registerLinkDef(this);
  }

  public ngOnDestroy(): void {
    this.navigationDef.unregisterLinkDef(this);
  }
}
