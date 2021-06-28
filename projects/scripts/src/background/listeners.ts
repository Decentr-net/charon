import { MessageBus } from '../../../../shared/message-bus';
import { MessageCode } from '../messages';
import { initCharonAPIListeners } from './charon-api';
import { mapTo, mergeMap } from 'rxjs/operators';
import { NETWORK_READY_SUBJECT } from './network-switch';

export const initMessageListeners = () => {
  const messageBus = new MessageBus();

  messageBus.onMessage(MessageCode.NetworkReady).pipe(
    mergeMap((message) => NETWORK_READY_SUBJECT.pipe(
      mapTo(message),
    )),
  ).subscribe((message) => message.sendResponse(void 0));

  initCharonAPIListeners();
}
