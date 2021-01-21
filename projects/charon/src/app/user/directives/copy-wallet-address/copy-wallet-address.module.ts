import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgModule } from '@angular/core';

import { CopyWalletAddressDirective } from './copy-wallet-address.directive';

@NgModule({
  imports: [
    ClipboardModule,
  ],
  declarations: [
    CopyWalletAddressDirective,
  ],
  exports: [
    CopyWalletAddressDirective,
  ],
})
export class CopyWalletAddressModule {
}
