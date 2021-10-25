import * as Browser from 'webextension-polyfill';

const PRIVACY_LINK = 'https://decentr.net/charon-privacy.html';

const openPolicyPage = () => {
  Browser.tabs.create({
    url: PRIVACY_LINK,
  });
};

const init = () => {
  Browser.contextMenus.create({
    title: 'Privacy policy',
    contexts: [
      'browser_action',
    ],
    onclick: openPolicyPage,
  });
};

export default init;
