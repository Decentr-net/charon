import { NgModule } from '@angular/core';

import { IntersectionAreaDirective } from './intersection-area.directive';
import { IntersectionTargetDirective } from './intersection-target.directive';

const INTERSECTION_DIRECTIVES = [
  IntersectionAreaDirective,
  IntersectionTargetDirective,
];

@NgModule({
  declarations: INTERSECTION_DIRECTIVES,
  exports: INTERSECTION_DIRECTIVES,
})
export class IntersectionModule {
}
