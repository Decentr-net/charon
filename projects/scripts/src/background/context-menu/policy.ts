import { browser } from 'webextension-polyfill-ts';

const PRIVACY_LINK = 'https://decentr.net/charon-privacy.html';

const openPolicyPage = () => {
  browser.tabs.create({
    url: PRIVACY_LINK,
  });
};

const init = () => {
  browser.contextMenus.create({
    title: 'Privacy policy',
    contexts: [
      'browser_action',
    ],
    onclick: openPolicyPage,
  });
};

export default init;
