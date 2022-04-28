import { Directive, OnInit, TemplateRef } from '@angular/core';

import { ExpansionListColumnDefDirective } from '../expansion-list-column';

@Directive({
  selector: '[appExpansionListLoading]',
})
export class ExpansionListLoadingDirective<T> implements OnInit {
  constructor(
    public columnDef: ExpansionListColumnDefDirective<T>,
    public templateRef: TemplateRef<unknown>,
  ) {
  }

  public ngOnInit(): void {
    this.columnDef.registerLoadingTemplate(this.templateRef);
  }
}
