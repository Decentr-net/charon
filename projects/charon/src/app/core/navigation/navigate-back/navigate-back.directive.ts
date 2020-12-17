import { Directive, HostListener, Input } from '@angular/core';

import { NavigationService } from '../navigation.service';

@Directive({
  selector: '[appNavigateBack]',
})
export class NavigateBackDirective {
  @Input() appNavigateBack: string[];

  constructor(
    private navigationService: NavigationService,
    ) {
  }

  @HostListener('click')
  public onClick(): void {
    this.navigationService.back(this.appNavigateBack);
  }
}
