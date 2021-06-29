import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { MessageBus } from '../../../../../../shared/message-bus';
import { LocationParams } from '../../../content/location';
import { MessageCode } from '../../../messages';

const messageBus = new MessageBus();

export const listenLocation = (): Observable<LocationParams> => {
  return messageBus.onMessageSync(MessageCode.Location).pipe(
    pluck('body'),
  );
}
