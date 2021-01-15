import { NgModule } from '@angular/core';

import { CopyWalletAddressDirective } from './copy-wallet-address.directive';

@NgModule({
  declarations: [
    CopyWalletAddressDirective,
  ],
  exports: [
    CopyWalletAddressDirective,
  ],
})
export class CopyWalletAddressModule {
}
