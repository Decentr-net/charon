import { handleProxyAuth } from './auth';
import { handleProxyStatus } from './configuration';
import { handleProxyErrors } from './errors';
import { initApplicationIconChanger } from './icon';

export const initProxy = (): void => {
  handleProxyAuth().subscribe();

  handleProxyErrors().subscribe();

  handleProxyStatus().subscribe();

  initApplicationIconChanger().subscribe();
};
