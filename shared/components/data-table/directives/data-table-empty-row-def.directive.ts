import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dataTableEmptyRowDef]',
})
export class DataTableEmptyRowDefDirective {
  constructor(public templateRef: TemplateRef<void>) {
  }
}
