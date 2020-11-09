import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { SpinnerComponent } from './spinner.component';

@Injectable()
export class SpinnerService {
  private readonly overlayRef: OverlayRef;
  private isAttached: boolean = false;

  constructor(private overlay: Overlay) {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true,
    });
  }

  public showSpinner(): void {
    if (this.isAttached) {
      return;
    }

    this.overlayRef.attach(new ComponentPortal(SpinnerComponent));
    this.isAttached = true;
  }

  public hideSpinner(): void {
    this.overlayRef.detach();
    this.isAttached = false;
  }
}
