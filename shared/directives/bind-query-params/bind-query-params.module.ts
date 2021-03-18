import { NgModule } from '@angular/core';

import { BindQueryParamsDirective } from './bind-query-params.directive';

@NgModule({
  declarations: [
    BindQueryParamsDirective,
  ],
  exports: [
    BindQueryParamsDirective,
  ],
})
export class BindQueryParamsModule {
}
