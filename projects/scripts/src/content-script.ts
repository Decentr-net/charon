import { isTopWindow } from './helpers/window';
import { createToolbarIframe } from './content/iframe';
import { browser } from 'webextension-polyfill-ts';

const iframe = createToolbarIframe();

if (isTopWindow(window.self)) {
  document.documentElement.append(iframe);
}

console.log(browser.extension.getURL('charon/index.html#/circle'));
