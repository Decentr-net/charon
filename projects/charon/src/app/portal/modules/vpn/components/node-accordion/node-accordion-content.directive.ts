import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appNodeAccordionContent]',
})
export class NodeAccordionContentDirective {
  constructor(
    public templateRef: TemplateRef<void>,
  ) {
  }
}
