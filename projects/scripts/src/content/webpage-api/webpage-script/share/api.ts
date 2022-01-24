import { take } from 'rxjs/operators';
import { Post } from 'decentr-js';

import { NetworkId } from '../../../../../../../shared/services/configuration';
import { WebpageAPIMessageBus, WebpageAPIRequestMessageCode } from '../../webpage-api-message-bus';

const messageBus = new WebpageAPIMessageBus();

export const openPost = (post: Pick<Post, 'owner' | 'uuid'>, networkId: NetworkId): Promise<void> => {
  return messageBus.sendRequest(WebpageAPIRequestMessageCode.OpenPost, { post, networkId }).pipe(
    take(1),
  ).toPromise();
};
