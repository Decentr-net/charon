import { AfterViewInit, Directive, TemplateRef, ViewContainerRef } from '@angular/core';

import { isOpenedInTab } from '../../utils/browser';

@Directive({
  selector: '[appBrowserTabView]'
})
export class BrowserTabViewDirective implements AfterViewInit {
  constructor(
    private templateRef: TemplateRef<void>,
    private viewContainerRef: ViewContainerRef,
  ) {
  }

  public ngAfterViewInit(): void {
    if (isOpenedInTab()) {
      this.viewContainerRef.createEmbeddedView(this.templateRef).detectChanges();
    }
  }
}
