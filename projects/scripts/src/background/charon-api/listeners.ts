import { BroadcastClientError, DeliverTxResponse } from 'decentr-js';

import { MessageBus } from '../../../../../shared/message-bus';
import { MessageCode } from '../../messages';
import {
  createPost,
  delegate,
  deletePost,
  follow,
  likePost,
  redelegate,
  resetAccount,
  transferCoins,
  undelegate,
  unfollow,
  withdrawDelegatorRewards,
  withdrawValidatorRewards,
} from './api';
import QUEUE, { QueuePriority } from '../queue';
import { CharonAPIMessageBusMap } from './message-bus-map';

interface RequestCallbackParams {
  success: boolean;
  error?: BroadcastClientError;
  messageValue?: DeliverTxResponse['data'][0];
}

const sendRequest = (
  fn: () => PromiseLike<DeliverTxResponse>,
  callback: (params: RequestCallbackParams) => void,
): void => {
  QUEUE.add(fn, { priority: QueuePriority.Charon })
    .then(
      () => callback({
        success: true,
      }),
      (error) => callback({
        success: false,
        error,
      }),
    );
};

type CharonAPIMessageCode = Exclude<MessageCode, MessageCode.Location>;

const CHARON_API_LISTENER_MAP: Record<CharonAPIMessageCode, (...args) => Promise<DeliverTxResponse>> = {
  [MessageCode.PostCreate]: createPost,
  [MessageCode.PostDelete]: deletePost,
  [MessageCode.PostLike]: likePost,
  [MessageCode.Follow]: follow,
  [MessageCode.Unfollow]: unfollow,
  [MessageCode.CoinTransfer]: transferCoins,
  [MessageCode.ResetAccount]: resetAccount,
  [MessageCode.Delegate]: delegate,
  [MessageCode.Undelegate]: undelegate,
  [MessageCode.Redelegate]: redelegate,
  [MessageCode.WithdrawDelegatorRewards]: withdrawDelegatorRewards,
  [MessageCode.WithdrawValidatorRewards]: withdrawValidatorRewards,
};

export const initCharonAPIListeners = (): void => {
  const messageBus = new MessageBus<CharonAPIMessageBusMap>();

  Object.entries(CHARON_API_LISTENER_MAP).forEach(([messageCode, handler]) => {
    messageBus.onMessage(messageCode as CharonAPIMessageCode).subscribe((message) => {
      sendRequest(
        () => handler(
          message.body.request,
          (message.body as CharonAPIMessageBusMap[MessageCode.CoinTransfer]['body']).memo,
        ),
        message.sendResponse,
      );
    });
  });
};
