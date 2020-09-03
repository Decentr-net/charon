import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { ReactiveFormsModule } from '@angular/forms';
import { MatchMediaService } from './services/match-media/match-media.service';
import { NavigationService } from './services/navigation/navigation.service';

@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule.forRoot(),
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    // Services
    NavigationService,
    MatchMediaService
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
