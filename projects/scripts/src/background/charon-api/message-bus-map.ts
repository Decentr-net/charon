import {
  BroadcastClientError,
  CreatePostRequest,
  DelegateTokensRequest,
  DeletePostRequest,
  FollowRequest,
  LikeRequest,
  RedelegateTokensRequest,
  ResetAccountRequest,
  SendTokensRequest,
  SubscribeToNodeRequest,
  UndelegateTokensRequest,
  UnfollowRequest,
  WithdrawDelegatorRewardRequest,
  WithdrawValidatorCommissionRequest,
} from 'decentr-js';

import { MessageMap } from '@shared/message-bus';
import { MessageCode } from '../../messages';

interface MessageResponse {
  success: boolean;
  error?: BroadcastClientError | Error;
}

export interface CharonAPIMessageBusMap extends MessageMap {
  [MessageCode.PostCreate]: {
    body: {
      request: CreatePostRequest;
    };
    response: MessageResponse;
  };
  [MessageCode.PostDelete]: {
    body: {
      request: DeletePostRequest;
    };
    response: MessageResponse;
  };
  [MessageCode.PostLike]: {
    body: {
      request: LikeRequest;
    };
    response: MessageResponse;
  };
  [MessageCode.CoinTransfer]: {
    body: {
      memo?: string;
      request: SendTokensRequest;
    };
    response: MessageResponse;
  };
  [MessageCode.Follow]: {
    body: {
      request: FollowRequest;
    };
    response: MessageResponse;
  };
  [MessageCode.Unfollow]: {
    body: {
      request: UnfollowRequest;
    };
    response: MessageResponse;
  };
  [MessageCode.ResetAccount]: {
    body: {
      request: ResetAccountRequest,
    };
    response: MessageResponse;
  };
  [MessageCode.Delegate]: {
    body: {
      request: DelegateTokensRequest;
    },
    response: MessageResponse;
  };
  [MessageCode.Redelegate]: {
    body: {
      request: RedelegateTokensRequest;
    },
    response: MessageResponse;
  };
  [MessageCode.Undelegate]: {
    body: {
      request: UndelegateTokensRequest;
    },
    response: MessageResponse;
  };
  [MessageCode.WithdrawDelegatorRewards]: {
    body: {
      request: WithdrawDelegatorRewardRequest,
    },
    response: MessageResponse;
  };
  [MessageCode.WithdrawValidatorRewards]: {
    body: {
      request: WithdrawValidatorCommissionRequest,
    },
    response: MessageResponse;
  };
  [MessageCode.SentinelSubscribeToNode]: {
    body: {
      request: SubscribeToNodeRequest,
    },
    response: MessageResponse;
  };
}

export const assertMessageResponseSuccess = (response: MessageResponse): void => {
  if (!response.success) {
    throw response.error as Error;
  }
};
