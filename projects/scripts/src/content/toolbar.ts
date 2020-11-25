import { browser } from 'webextension-polyfill-ts';

export const createToolbarIframe = (): HTMLIFrameElement => {
  const toolbarSrc = browser.extension.getURL('toolbar/index.html');

  const iframe = document.createElement('iframe');
  iframe.src = toolbarSrc;

  iframe.style.border = '0';
  iframe.style.height = '33px';
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.width = '100%';
  iframe.style.zIndex = '10000000';

  return iframe;
}
