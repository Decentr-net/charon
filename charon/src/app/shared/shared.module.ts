import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { ReactiveFormsModule } from '@angular/forms';
import { MatchMediaService } from './services/match-media/match-media.service';
import { NavigationService } from './services/navigation/navigation.service';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { RouterModule } from '@angular/router';
import { LayoutHeaderComponent } from './components/layout-header/layout-header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    InlineSVGModule.forRoot(),
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    MainLayoutComponent,
    LayoutHeaderComponent
  ],
  providers: [
    // Services
    NavigationService,
    MatchMediaService
  ],
  exports: [
    // Modules
    CommonModule,
    RouterModule,
    InlineSVGModule,
    MaterialModule,
    ReactiveFormsModule,
    // Components
    MainLayoutComponent,
    LayoutHeaderComponent
  ]
})
export class SharedModule {
}
