import { NgModule } from '@angular/core';

import { ClipboardCopiedNotificationDirective } from './clipboard-copied-notification.directive';

@NgModule({
  declarations: [
    ClipboardCopiedNotificationDirective,
  ],
  exports: [
    ClipboardCopiedNotificationDirective,
  ],
})
export class ClipboardCopiedNotificationModule {
}
