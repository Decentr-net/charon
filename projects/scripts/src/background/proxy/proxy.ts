import { listenProxyErrors, setProxy } from '../../../../../shared/utils/browser';

export const handleProxyErrors = (): void => {
  listenProxyErrors().subscribe(() => setProxy(undefined));
};
