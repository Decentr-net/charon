import { Directive, OnDestroy, OnInit, TemplateRef } from '@angular/core';

import { AuthorizedLayoutNavigationService } from './authorized-layout-navigation.service';

@Directive({
  selector: '[appAuthorizedLayoutNavigationContentDef]'
})
export class AuthorizedLayoutNavigationContentDefDirective implements OnInit, OnDestroy {
  constructor(
    private authorizedLayoutService: AuthorizedLayoutNavigationService,
    public templateRef: TemplateRef<void>,
  ) {
  }

  public ngOnInit(): void {
    this.authorizedLayoutService.registerContent(this);
  }

  public ngOnDestroy(): void {
    this.authorizedLayoutService.unregisterContent(this);
  }
}
