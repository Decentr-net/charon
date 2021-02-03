import { noop } from 'rxjs';
import { browser } from 'webextension-polyfill-ts';

import { MessageBus } from '../../../../shared/message-bus';
import { openCharonPage } from '../../../../shared/utils/navigation';
import { MessageCode } from '../messages';
import { initCharonAPIListeners } from './charon-api';

export const initMessageListeners = () => {
  const messageBus = new MessageBus();

  messageBus.onMessage(MessageCode.Navigate).subscribe(({ body: routes }) => {
    openCharonPage(routes);
  });

  messageBus.onMessage(MessageCode.ToolbarClose).subscribe(() => {
    messageBus.sendMessageToCurrentTab(MessageCode.ToolbarClose);
  });

  browser.runtime.onConnect.addListener(noop);

  initCharonAPIListeners();
}
