import Browser from 'webextension-polyfill';

export const isInstalledAsExtension = (): Promise<boolean> => {
  return Browser.management.getAll()
    .then((extensions) => !!extensions.find((extension) => extension.id === Browser.runtime.id));
};
