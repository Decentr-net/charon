import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule.forRoot(),
    MaterialModule
  ],
  exports: [
    InlineSVGModule,
    MaterialModule
  ]
})
export class SharedModule {
}
