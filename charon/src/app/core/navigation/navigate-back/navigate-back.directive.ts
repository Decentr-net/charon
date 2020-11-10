import { Directive, HostListener } from '@angular/core';

import { NavigationService } from '../navigation.service';

@Directive({
  selector: '[appNavigateBack]',
})
export class NavigateBackDirective {
  constructor(private navigationService: NavigationService) {
  }

  @HostListener('click')
  public onClick(): void {
    this.navigationService.back();
  }
}
