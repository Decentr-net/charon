import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appDetailsTableCellDef]',
})
export class DetailsTableCellDefDirective {
  @Input('appDetailsTableCellDef') public name: string;

  constructor(public templateRef: TemplateRef<{ $implicit: any }>) {
  }
}
