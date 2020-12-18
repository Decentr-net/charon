import { noop } from 'rxjs';
import { browser, Tabs } from 'webextension-polyfill-ts';

import { MessageBus } from '../../../../shared/message-bus';
import { openCharonPage } from '../helpers/navigation';
import { MessageCode } from '../messages';
import Tab = Tabs.Tab;

export const registeredTabs: Tab['id'][] = [];

export const initMessageListeners = () => {
  const messageBus = new MessageBus();

  messageBus.onMessage(MessageCode.Navigate).subscribe(({ body: routes }) => {
    openCharonPage(routes);
  });

  messageBus.onMessage(MessageCode.ToolbarClose).subscribe(() => {
    messageBus.sendMessageToCurrentTab(MessageCode.ToolbarClose);
  });

  messageBus.onMessage(MessageCode.RegisterTab).subscribe(({ sender }) => {
    if (sender.tab) {
      registeredTabs.push(sender.tab.id)
    }
  })

  browser.runtime.onConnect.addListener(noop);
}
