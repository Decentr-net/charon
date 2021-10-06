import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dataTableColumnDef]',
})
export class DataTableColumnDefDirective {
  @Input('dataTableColumnDefName') public name: string;

  constructor(public templateRef: TemplateRef<{ $implicit: any }>) {
  }
}
