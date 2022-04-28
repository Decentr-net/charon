import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MessageBus } from '../../../../../../shared/message-bus';
import { LocationParams } from '../../../content/location';
import { MessageCode } from '../../../messages';

const messageBus = new MessageBus<{
  [MessageCode.Location]: {
    body?: LocationParams;
  };
}>();

export const listenLocation = (): Observable<LocationParams> => {
  return messageBus.onMessageSync(MessageCode.Location).pipe(
    map((message) => message.body),
  );
};
