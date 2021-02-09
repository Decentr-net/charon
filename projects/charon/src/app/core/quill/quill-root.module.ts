import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    QuillModule.forRoot({
      modules: {
        toolbar: [
        ],
      },
    }),
  ],
  exports: [
    QuillModule,
  ],
})
export class QuillRootModule {
}
