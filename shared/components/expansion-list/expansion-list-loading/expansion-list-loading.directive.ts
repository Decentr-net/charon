import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appExpansionListLoading]',
})
export class ExpansionListLoadingDirective {
  constructor(
    public templateRef: TemplateRef<{ $implicit: any }>,
  ) {
  }
}
