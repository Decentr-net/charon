import { Directive, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AuthorizedLayoutService } from '@core/layout/authorized-layout/authorized-layout.service';

@Directive({
  selector: '[appAuthorizedLayoutFooterDef]',
})
export class AuthorizedLayoutFooterDefDirective implements OnInit, OnDestroy {
  constructor(
    private authorizedLayoutService: AuthorizedLayoutService,
    public templateRef: TemplateRef<void>,
  ) {
  }

  public ngOnInit(): void {
    this.authorizedLayoutService.registerFooter(this);
  }

  public ngOnDestroy(): void {
    this.authorizedLayoutService.unregisterFooter(this);
  }
}
