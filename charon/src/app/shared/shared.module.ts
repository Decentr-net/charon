import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { NavigationService } from './services/navigation.service';

@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule.forRoot(),
    MaterialModule
  ],
  providers: [
    // Services
    NavigationService
  ],
  exports: [
    InlineSVGModule,
    MaterialModule
  ]
})
export class SharedModule {
}
