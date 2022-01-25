import * as browser from 'webextension-polyfill';
import { Post } from 'decentr-js';

import { AppRoute } from '../../../../charon/src/app/app-route';
import { HubRoute } from '../../../../charon/src/app/hub';
import { NetworkId } from '../../../../../shared/services/configuration';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import CONFIG_SERVICE from '../config';

const createExtensionUrl = (path?: string): string => {
  return browser.runtime.getURL(`charon/index.html#${path || ''}`);
};

const openPopupTab = (
  url: string,
  options?: {
    height?: number;
    width?: number;
    outerWidth?: number;
    screenX?: number;
    screenY?: number;
  },
): Promise<void> => {
  const height = options?.height || 500;
  const width = options?.width || 400;

  const popupOptions = {
    height,
    left: Math.min(
      Math.max((options.screenX || 0) + (options.outerWidth || window.screen.width) - width, 0
    ), window.screen.width - width),
    top: Math.max(options.screenY, 0),
    width,
  };

  return browser.windows.create({
    url,
    type: 'popup',
    ...popupOptions,
  })
    .then((popupWindow) => browser.windows.update(popupWindow.id, popupOptions))
    .then();
};

export const openExtension = (path?: string, popup?: boolean): Promise<void> => {
  const url = createExtensionUrl(path);

  return popup
    ? openPopupTab(url)
    : browser.tabs.create({ url }).then();
};

export const openPost = async (post: Pick<Post, 'owner' | 'uuid'>, networkId: NetworkId): Promise<void> => {
  const networkIds = await CONFIG_SERVICE.getNetworkIds().toPromise();

  if (!networkIds.includes(networkId)) {
    return Promise.reject('Invalid network');
  }

  await new NetworkBrowserStorageService().setActiveId(networkId);

  const path = `/${AppRoute.Hub}/${HubRoute.Posts}/0/${HubRoute.Post}/${post.owner}/${post.uuid}`;

  return openExtension(path);
};
