import { browser } from 'webextension-polyfill-ts';

import { TOOLBAR_HEIGHT } from '../../../toolbar/src/app';

export const createToolbarIframe = (): HTMLIFrameElement => {
  const toolbarSrc = browser.extension.getURL('toolbar/index.html');

  const iframe = document.createElement('iframe');
  iframe.src = toolbarSrc;

  iframe.style.border = '0';
  iframe.style.height = TOOLBAR_HEIGHT;
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.width = '100%';
  iframe.style.zIndex = '10000000';

  return iframe;
}


