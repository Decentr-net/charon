import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayRef } from '@angular/cdk/overlay/overlay-ref';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay) {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });
  }

  showSpinner() {
    this.overlayRef.attach(new ComponentPortal(SpinnerComponent));
  }

  hideSpinner() {
    this.overlayRef.detach();
  }
}
