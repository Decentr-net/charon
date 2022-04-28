import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { PermissionsService } from '../permissions.service';

@UntilDestroy()
@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective<T> implements OnInit {
  @Input('appHasPermission') set permissions(value: T | T[]) {
    this.permissions$.next(value);
  }

  private permissions$: ReplaySubject<T | T[]> = new ReplaySubject(1);

  constructor(
    private permissionService: PermissionsService<T>,
    private templateRef: TemplateRef<void>,
    private viewContainerRef: ViewContainerRef,
  ) {
  }

  public ngOnInit(): void {
    this.permissions$.pipe(
      switchMap((permissions) => this.permissionService.hasPermissions(permissions)),
      untilDestroyed(this),
    ).subscribe((hasPermissions) => {
      if (!hasPermissions) {
        this.viewContainerRef.clear();
        return;
      }

      if (!this.viewContainerRef.length) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    });
  }
}
