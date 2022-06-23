import { firstValueFrom } from 'rxjs';
import { Post } from 'decentr-js';

import { NetworkId } from '@shared/services/configuration/config.definitions';
import { WebpageAPIMessageBus, WebpageAPIRequestMessageCode } from '../../webpage-api-message-bus';

const messageBus = new WebpageAPIMessageBus();

export const openPost = (post: Pick<Post, 'owner' | 'uuid'>, networkId: NetworkId): Promise<void> => {
  return firstValueFrom(
    messageBus.sendRequest(WebpageAPIRequestMessageCode.OpenPost, { post, networkId }),
  );
};
