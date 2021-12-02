import { Directive, Host, Input, OnInit } from '@angular/core';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { switchMap, take } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NotificationService } from '@shared/services/notification';

@UntilDestroy()
@Directive({
  selector: '[appClipboardCopiedNotification]',
})
export class ClipboardCopiedNotificationDirective implements OnInit {
  @Input('appClipboardCopiedNotification') public notificationI18nKey: string;

  constructor(
    @Host() private cdkCopyToClipboard: CdkCopyToClipboard,
    private notificationService: NotificationService,
    private translocoService: TranslocoService,
  ) {
  }

  public ngOnInit(): void {
    this.cdkCopyToClipboard.copied.pipe(
      switchMap(() => this.translocoService.selectTranslate(this.notificationI18nKey).pipe(
        take(1),
      )),
      untilDestroyed(this),
    ).subscribe((notification) => this.notificationService.success(notification));
  }
}
