import { browser } from 'webextension-polyfill-ts';
import { TOOLBAR_HEIGHT } from '../../../toolbar/src/app';

export enum toolbar {
  iframe = 'charon-toolbar',
  shiftSpacer = 'charon-toolbar-shift-spacer'
}

export const createToolbarIframe = (height: string): HTMLIFrameElement => {
  const toolbarSrc = browser.extension.getURL('toolbar/index.html');
  const iframe = document.createElement('iframe');

  iframe.src = toolbarSrc;
  iframe.id = toolbar.iframe;

  iframe.style.border = '0';
  iframe.style.bottom = 'auto';
  iframe.style.display = 'block';
  iframe.style.height = TOOLBAR_HEIGHT;
  iframe.style.left = '0';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.top = '0';
  iframe.style.width = '100%';
  iframe.style.zIndex = '10000000';

  return iframe;
};

export const createToolbarShiftSpacer = (height: string): HTMLDivElement => {
  const div = document.createElement('div');

  div.id = toolbar.shiftSpacer;

  div.style.display = 'block';
  div.style.height = height;
  div.style.width = '100%';

  return div;
};
