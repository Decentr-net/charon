import * as browser from 'webextension-polyfill';

import { AppRoute } from '../../../../../../charon/src/app/app-route';
import { HubRoute } from '../../../../../../charon/src/app/hub';
import {
  NETWORK_ID_QUERY_PARAM,
} from '../../../../../../charon/src/app/core/services/network-selector/network-selector.definitions';
import { WebpageAPIRequestMessageCode, WebpageAPIRequestMessageMap } from '../../webpage-api-message-bus';

const createExtensionUrl = (path?: string): string => {
  return browser.runtime.getURL(`charon/index.html#${path || ''}`);
};

export const getPostLink = (params: WebpageAPIRequestMessageMap[WebpageAPIRequestMessageCode.GetPostLink]): Promise<string> => {
  const path = `/${AppRoute.Hub}/${HubRoute.Posts}/0/${HubRoute.Post}/${params.post.author}/${params.post.postId}?${NETWORK_ID_QUERY_PARAM}=${params.networkId}`;

  const url = createExtensionUrl(path);

  return Promise.resolve(url);
};
