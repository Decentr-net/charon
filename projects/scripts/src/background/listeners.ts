import { noop } from 'rxjs';
import { browser } from 'webextension-polyfill-ts';

import { MessageBus } from '../../../../shared/message-bus';
import { openCharonPage } from '../../../../shared/utils/navigation';
import { MessageCode } from '../messages';
import { initCharonAPIListeners } from './charon-api';
import { mapTo, mergeMap } from 'rxjs/operators';
import { NETWORK_READY_SUBJECT } from './network-switch';

export const initMessageListeners = () => {
  const messageBus = new MessageBus();

  messageBus.onMessage(MessageCode.Navigate).subscribe(({ body: routes }) => {
    openCharonPage(routes);
  });

  messageBus.onMessage(MessageCode.ToolbarClose).subscribe(() => {
    messageBus.sendMessageToCurrentTab(MessageCode.ToolbarClose);
  });

  messageBus.onMessage(MessageCode.NetworkReady).pipe(
    mergeMap((message) => NETWORK_READY_SUBJECT.pipe(
      mapTo(message),
    )),
  ).subscribe((message) => message.sendResponse(void 0));

  browser.runtime.onConnect.addListener(noop);

  initCharonAPIListeners();
}
