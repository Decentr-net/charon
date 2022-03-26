import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dataTableColumnDef]',
})
export class DataTableColumnDefDirective {
  @Input('dataTableColumnDefId') public id: string;

  @Input('dataTableColumnDefName') public name: string;

  @Input('dataTableColumnDefAlign') public align: 'left' | 'right' = 'left';

  @Input('dataTableColumnDefWidth') public width: string;

  constructor(public templateRef: TemplateRef<never>) {
  }

  public get idOrName(): string {
    return this.id || this.name;
  }
}
