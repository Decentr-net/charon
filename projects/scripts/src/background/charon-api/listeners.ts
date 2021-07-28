import { BroadcastResponse, BroadcastSuccessResponse, StdTxMessageValue, StdTxMessageValueMap } from 'decentr-js';

import { MessageBus } from '../../../../../shared/message-bus';
import { MessageCode } from '../../messages';
import {
  createPost,
  deletePost,
  follow,
  likePost,
  resetAccount,
  transferCoins,
  unfollow,
} from './api';
import QUEUE, { QueuePriority } from '../queue';
import { CharonAPIMessageBusMap } from './message-bus-map';

interface RequestCallbackParams<K extends keyof StdTxMessageValueMap> {
  success: boolean;
  error?: any;
  messageValue?: StdTxMessageValue<K>;
}

const sendRequest = <K extends keyof StdTxMessageValueMap>(
  fn: () => PromiseLike<BroadcastResponse<K>>,
  callback: (params: RequestCallbackParams<K>) => void,
): void => {
  QUEUE.add(fn, { priority: QueuePriority.Charon })
    .then(
      (response: BroadcastSuccessResponse<K>) => callback({
        success: true,
        messageValue: response.stdTxValue.msg[0].value,
      }),
      (error) => callback({
        success: false,
        error,
      }),
    );
}

export const initCharonAPIListeners = () => {
  const messageBus = new MessageBus<CharonAPIMessageBusMap>();

  messageBus.onMessage(MessageCode.PostCreate).subscribe((message) => {
    sendRequest(
      () => createPost(
        message.body.walletAddress,
        message.body.post,
        message.body.privateKey,
      ),
      message.sendResponse,
    );
  });

  messageBus.onMessage(MessageCode.PostDelete).subscribe((message) => {
    sendRequest(
      () => deletePost(
        message.body.walletAddress,
        message.body.postIdentificationParameters,
        message.body.privateKey,
      ),
      message.sendResponse,
    );
  });

  messageBus.onMessage(MessageCode.PostLike).subscribe((message) => {
    sendRequest(
      () => likePost(
        message.body.walletAddress,
        message.body.postIdentificationParameters,
        message.body.likeWeight,
        message.body.privateKey,
      ),
      message.sendResponse,
    );
  });

  messageBus.onMessage(MessageCode.CoinTransfer).subscribe((message) => {
    sendRequest(
      () => transferCoins(
        message.body.transferData,
        message.body.privateKey
      ),
      (response) => {
        messageBus.sendMessage(MessageCode.CoinTransferred);
        message.sendResponse(response);
      },
    );
  });

  messageBus.onMessage(MessageCode.Follow).subscribe((message) => {
    sendRequest(
      () => follow(
        message.body.follower,
        message.body.whom,
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
        message.body.follower,
        message.body.whom,
        message.body.privateKey,
      ),
      (response) => {
        message.sendResponse(response);
      },
    );
  });

  messageBus.onMessage(MessageCode.ResetAccount).subscribe((message) => {
    sendRequest(
      () => resetAccount(
        message.body.walletAddress,
        message.body.initiator,
        message.body.privateKey,
      ),
      (response) => {
        message.sendResponse(response);
      },
    );
  });
};
