import { take } from 'rxjs/operators';
import { PostIdentificationParameters } from 'decentr-js';

import { WebpageAPIMessageBus, WebpageAPIRequestMessageCode } from '../../webpage-api-message-bus';

const messageBus = new WebpageAPIMessageBus();

export const getPostLink = (post: PostIdentificationParameters, networkId: string): Promise<string> => {
  return messageBus.sendRequest(WebpageAPIRequestMessageCode.GetPostLink, { post, networkId }).pipe(
    take(1),
  ).toPromise();
};
