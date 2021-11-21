import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Post } from 'decentr-js';

import { PermissionsService } from '@shared/permissions';
import { UserPermissions } from '@core/permissions';
import { AuthService } from '@core/auth';

@UntilDestroy()
@Directive({
  selector: '[appHubCanDeletePost]'
})
export class HubCanDeletePostDirective implements OnInit {
  @Input('appHubCanDeletePost') public set postAuthor(value: Post['owner']) {
    this.postAuthor$.next(value);
  }

  private postAuthor$: BehaviorSubject<Post['uuid']> = new BehaviorSubject(undefined);

  constructor(
    private authService: AuthService,
    private permissionsService: PermissionsService,
    private templateRef: TemplateRef<void>,
    private viewContainerRef: ViewContainerRef
  ) { }

  public ngOnInit(): void {
    combineLatest([
      this.authService.getActiveUser(),
      this.postAuthor$,
      this.permissionsService.hasPermissions(UserPermissions.DELETE_POST),
    ]).pipe(
      map(([user, postAuthor, isModerator]) => {
        return isModerator || user.wallet.address === postAuthor;
      }),
      distinctUntilChanged(),
      untilDestroyed(this),
    ).subscribe((canDelete) => canDelete
      ? this.viewContainerRef.createEmbeddedView(this.templateRef)
      : this.viewContainerRef.clear()
    );
  }
}
