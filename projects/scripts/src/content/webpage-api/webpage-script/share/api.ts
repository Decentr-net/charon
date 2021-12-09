import { take } from 'rxjs/operators';
import { PostIdentificationParameters } from 'decentr-js';

import { WebpageAPIMessageBus, WebpageAPIRequestMessageCode } from '../../webpage-api-message-bus';

const messageBus = new WebpageAPIMessageBus();

export const openPost = (post: PostIdentificationParameters, networkId: string): Promise<void> => {
  return messageBus.sendRequest(WebpageAPIRequestMessageCode.OpenPost, { post, networkId }).pipe(
    take(1),
  ).toPromise();
};
