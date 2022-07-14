import { initApplicationIconChanger } from './wireguard';
import { initCharonAPIListeners } from './charon-api';
import { initWebpageAPIListeners } from './webpage-api';

export const initMessageListeners = () => {
  initCharonAPIListeners();

  initWebpageAPIListeners();

  initApplicationIconChanger();
};
