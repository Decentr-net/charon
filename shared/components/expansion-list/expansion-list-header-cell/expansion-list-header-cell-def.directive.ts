import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appExpansionListHeaderCellDef]',
})
export class ExpansionListHeaderCellDefDirective<T> {
  constructor(
    public templateRef: TemplateRef<{ $implicit: T }>,
  ) {
  }
}
