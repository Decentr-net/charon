import { browser } from 'webextension-polyfill-ts';

export const createToolbarIframe = (): HTMLIFrameElement => {
  const toolbarSrc = browser.extension.getURL('toolbar/index.html');

  const iframe = document.createElement('iframe');
  iframe.src = toolbarSrc;

  iframe.addEventListener('load', () => {
    // console.log(iframe);
    // iframe.height = iframe.scrollHeight;
  })

  return iframe;
}
