import { Directive, HostListener, Input } from '@angular/core';
import { coerceArray } from '@angular/cdk/coercion';

import { NavigationService } from '../navigation.service';

@Directive({
  selector: '[appNavigateBack]',
})
export class NavigateBackDirective {
  @Input('appNavigateBack') fallbackUrl: string[];

  @Input('appNavigateBackStartsWith') startsWith: string | string[];

  constructor(
    private navigationService: NavigationService,
  ) {
  }

  @HostListener('click')
  public onClick(): void {
    this.navigationService.back(
      this.fallbackUrl,
      this.startsWith && coerceArray(this.startsWith).join(''),
    );
  }
}
