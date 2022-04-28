import * as browser from 'webextension-polyfill';
import { firstValueFrom } from 'rxjs';
import { Post } from 'decentr-js';

import { LockParam, LockReturnUrlParam } from '../../../../charon/src/app/core/lock/services/lock.definitions';
import { APP_TITLE } from '../../../../charon/src/app/app.definitions';
import { AppRoute } from '../../../../charon/src/app/app-route';
import { HubRoute } from '../../../../charon/src/app/hub';
import { NetworkId } from '../../../../../shared/services/configuration/config.definitions';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import { POPUP_TAB_QUERY_PARAM } from '../../../../../shared/utils/browser';
import CONFIG_SERVICE from '../config';

const createExtensionUrl = (path?: string): string => {
  return browser.runtime.getURL(`charon/index.html#${path || ''}`);
};

interface PopupOptions {
  height?: number;
  width?: number;
  outerWidth?: number;
  screenX?: number;
  screenY?: number;
}

const openPopupTab = (
  url: string,
  options?: PopupOptions,
): Promise<browser.Windows.Window> => {
  const height = options?.height || 500;
  const width = options?.width || 400;
  const popupOptions = {
    height,
    left: Math.min(
      Math.max((options.screenX || 0) + (options.outerWidth || window.screen.width) - width, 0),
      window.screen.width - width,
    ),
    top: Math.max(options.screenY || 0, 0),
    width,
  };

  return browser.windows.create({
    url,
    type: 'popup',
    ...popupOptions,
  })
    .then((popupWindow) => browser.windows.update(popupWindow.id, popupOptions));
};

export const openExtension = async (path?: string, popupOptions?: PopupOptions): Promise<browser.Windows.Window> => {
  const url = createExtensionUrl(path);

  const charonTabs = await browser.tabs.query({ title: APP_TITLE });
  const existingTab = charonTabs.find((tab) => tab.url === url);

  if (existingTab) {
    return browser.tabs.update(existingTab.id, { active: true, highlighted: true }).then();
  }

  return popupOptions
    ? openPopupTab(url, popupOptions)
    : browser.tabs.create({ url }).then();
};

export const openPost = async (post: Pick<Post, 'owner' | 'uuid'>, networkId: NetworkId): Promise<void> => {
  const networkIds = await firstValueFrom(CONFIG_SERVICE.getNetworkIds());

  if (!networkIds.includes(networkId)) {
    return Promise.reject('Invalid network');
  }

  await new NetworkBrowserStorageService().setActiveId(networkId);

  const path = `/${AppRoute.Hub}/${HubRoute.Posts}/0/${HubRoute.Post}/${post.owner}/${post.uuid}`;

  return openExtension(path).then();
};

let currentUnlockWindow: browser.Windows.Window;
export const unlock = async (): Promise<void> => {
  await browser.windows.remove(currentUnlockWindow?.id)
    .catch(() => undefined);

  const queryParams = new URLSearchParams();
  queryParams.append(LockParam.ReturnUrl, LockReturnUrlParam.Close);
  queryParams.append(POPUP_TAB_QUERY_PARAM, Boolean(true).toString());

  const path = `/${AppRoute.Login}?${queryParams.toString()}`;

  currentUnlockWindow = await openExtension(path, { height: 380, width: 420 });
};
