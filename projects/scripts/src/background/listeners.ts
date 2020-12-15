import { MessageBus } from '../../../../shared/message-bus';
import { openCharonPage } from '../helpers/navigation';
import { MessageCode } from '../messages';

export const initMessageListeners = () => {
  const messageBus = new MessageBus();

  messageBus.onMessage(MessageCode.Navigate).subscribe(({ body: routes }) => {
    openCharonPage(routes);
  });

  messageBus.onMessage(MessageCode.ToolbarClose).subscribe(() => {
    messageBus.sendMessageToTabs(MessageCode.ToolbarClose);
  });
}
