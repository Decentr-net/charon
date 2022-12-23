import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { delay, filter, startWith } from 'rxjs/operators';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
  selector: '[appRouterLinkScrollAnchor]',
})
export class RouterLinkScrollAnchorDirective implements AfterViewInit {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private router: Router,
    private routerLink: RouterLink,
  ) {
  }

  ngAfterViewInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(0),
      delay(100),
      untilDestroyed(this),
    ).subscribe(() => {
      if (this.router.isActive(this.routerLink.urlTree, true)) {
        this.elementRef.nativeElement.scrollIntoView();
      }
    });
  }
}
