import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { NavigationService } from './services/navigation.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule.forRoot(),
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    // Services
    NavigationService
  ],
  exports: [
    CommonModule,
    InlineSVGModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
}
