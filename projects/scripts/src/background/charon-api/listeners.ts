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

export const initCharonAPIListeners = (): void => {
  const messageBus = new MessageBus<CharonAPIMessageBusMap>();

  messageBus.onMessage(MessageCode.PostCreate).subscribe((message) => {
    sendRequest(
      () => createPost(
        message.body.request,
        message.body.privateKey,
      ),
      message.sendResponse,
    );
  });

  messageBus.onMessage(MessageCode.PostDelete).subscribe((message) => {
    sendRequest(
      () => deletePost(
        message.body.request,
        message.body.privateKey,
      ),
      message.sendResponse,
    );
  });

  messageBus.onMessage(MessageCode.PostLike).subscribe((message) => {
    sendRequest(
      () => likePost(
        message.body.request,
        message.body.privateKey,
      ),
      message.sendResponse,
    );
  });

  messageBus.onMessage(MessageCode.Follow).subscribe((message) => {
    sendRequest(
      () => follow(
        message.body.request,
        message.body.privateKey,
      ),
      (response) => {
        message.sendResponse(response);
      },
    );
  });

  messageBus.onMessage(MessageCode.Unfollow).subscribe((message) => {
    sendRequest(
      () => unfollow(
        message.body.request,
        message.body.privateKey,
      ),
      (response) => {
        message.sendResponse(response);
      },
    );
  });

  messageBus.onMessage(MessageCode.CoinTransfer).subscribe((message) => {
    sendRequest(
      () => transferCoins(
        message.body.request,
        message.body.privateKey,
        message.body.memo,
      ),
      (response) => {
        message.sendResponse(response);
      },
    );
  });

  messageBus.onMessage(MessageCode.ResetAccount).subscribe((message) => {
    sendRequest(
      () => resetAccount(
        message.body.request,
        message.body.privateKey,
      ),
      (response) => {
        message.sendResponse(response);
      },
    );
  });

  messageBus.onMessage(MessageCode.Delegate).subscribe((message) => {
    sendRequest(
      () => delegate(
        message.body.request,
        message.body.privateKey,
      ),
      (response) => {
        message.sendResponse(response);
      },
    );
  });

  messageBus.onMessage(MessageCode.Redelegate).subscribe((message) => {
    sendRequest(
      () => redelegate(
        message.body.request,
        message.body.privateKey,
      ),
      (response) => {
        message.sendResponse(response);
      },
    );
  });

  messageBus.onMessage(MessageCode.Undelegate).subscribe((message) => {
    sendRequest(
      () => undelegate(
        message.body.request,
        message.body.privateKey,
      ),
      (response) => {
        message.sendResponse(response);
      },
    );
  });

  messageBus.onMessage(MessageCode.WithdrawDelegatorRewards).subscribe((message) => {
    sendRequest(
      () => withdrawDelegatorRewards(
        message.body.request,
        message.body.privateKey,
      ),
      (response) => {
        message.sendResponse(response);
      },
    );
  });

  messageBus.onMessage(MessageCode.WithdrawValidatorRewards).subscribe((message) => {
    sendRequest(
      () => withdrawValidatorRewards(
        message.body.request,
        message.body.privateKey,
      ),
      (response) => {
        message.sendResponse(response);
      },
    );
  });
};
