import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appExpansionListCellDef]',
})
export class ExpansionListCellDefDirective<T> {
  constructor(
    public templateRef: TemplateRef<{ $implicit: T }>,
  ) {
  }
}
