import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    QuillModule.forRoot({
      modules: {
        toolbar: [
        //   ['bold', 'italic', 'underline', 'strike'],
        //   [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        //   [{ 'color': [] }, { 'background': [] }],
        //   [{ 'font': [] }],
        //   [{ size: [] }],
        //   [{ align: [] }],
        //   ['clean'],
        //   ['link', 'image', 'video'],
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
