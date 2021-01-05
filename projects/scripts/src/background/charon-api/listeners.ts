import { MessageBus } from '../../../../../shared/message-bus';
import { MessageCode } from '../../messages';
import { createPost, deletePost, likePost, setPrivateProfile, setPublicProfile } from './api';
import QUEUE, { QueuePriority } from '../queue';
import { CharonAPIMessageBusMap } from './message-bus-map';

const sendRequest = <T>(
  fn: () => PromiseLike<T>,
  callback: ({ success: boolean, error: any }) => void,
): void => {
  QUEUE.add(fn, { priority: QueuePriority.Charon })
    .then(
      () => callback({ success: true, error: undefined }),
      (error) => callback({ success: false, error }),
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

  messageBus.onMessage(MessageCode.PrivateProfileUpdate).subscribe((message) => {
    sendRequest(
      () => setPrivateProfile(
        message.body.walletAddress,
        message.body.privateProfile,
        message.body.privateKey,
      ),
      message.sendResponse,
    );
  });

  messageBus.onMessage(MessageCode.PublicProfileUpdate).subscribe((message) => {
    sendRequest(
      () => setPublicProfile(
        message.body.walletAddress,
        message.body.publicProfile,
        message.body.privateKey,
      ),
      message.sendResponse,
    );
  });
};
