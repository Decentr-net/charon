import initPolicy from './policy';
import initWireguard from './wireguard';

const init = () => {
  initPolicy();
  initWireguard();
};

export default init;
