import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { STAKING_PAGES } from './pages';
import { StakingRoutingModule } from './staking-routing.module';

@NgModule({
  declarations: [
    STAKING_PAGES,
  ],
  imports: [
    CommonModule,
    StakingRoutingModule
  ],
  providers: [
  ],
})
export class StakingModule {
}
