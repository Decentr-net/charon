import { Directive, OnInit, TemplateRef } from '@angular/core';
import { ExpansionListColumnDefDirective } from '../expansion-list-column';

@Directive({
  selector: '[appExpansionListColumnFooterDef]',
})
export class ExpansionListColumnFooterDefDirective<T> implements OnInit {
  constructor(
    public columnDef: ExpansionListColumnDefDirective<T>,
    private templateRef: TemplateRef<void>,
  ) {
  }

  public ngOnInit(): void {
    this.columnDef.registerFooterTemplate(this.templateRef);
  }
}
