import {
  CreatePostRequest,
  DelegateTokensRequest,
  DeletePostRequest,
  FollowRequest,
  LikeRequest,
  RedelegateTokensRequest,
  ResetAccountRequest,
  SendTokensRequest,
  UndelegateTokensRequest,
  UnfollowRequest,
  Wallet,
  WithdrawDelegatorRewardRequest,
  WithdrawValidatorCommissionRequest,
} from 'decentr-js';

import { MessageMap } from '../../../../../shared/message-bus';
import { MessageCode } from '../../messages';

interface MessageResponse {
  success: boolean;
  error?: any;
}

export interface CharonAPIMessageBusMap extends MessageMap {
  [MessageCode.PostCreate]: {
    body: {
      request: CreatePostRequest;
      privateKey: Wallet['privateKey'];
    };
    response: MessageResponse;
  };
  [MessageCode.PostDelete]: {
    body: {
      request: DeletePostRequest;
      privateKey: Wallet['privateKey'];
    };
    response: MessageResponse;
  };
  [MessageCode.PostLike]: {
    body: {
      request: LikeRequest;
      privateKey: Wallet['privateKey'];
    };
    response: MessageResponse;
  };
  [MessageCode.CoinTransfer]: {
    body: {
      memo?: string;
      request: SendTokensRequest;
      privateKey: Wallet['privateKey'];
    };
    response: MessageResponse;
  };
  [MessageCode.Follow]: {
    body: {
      request: FollowRequest;
      privateKey: Wallet['address'];
    };
    response: MessageResponse;
  };
  [MessageCode.Unfollow]: {
    body: {
      request: UnfollowRequest;
      privateKey: Wallet['address'];
    };
    response: MessageResponse;
  };
  [MessageCode.ResetAccount]: {
    body: {
      request: ResetAccountRequest,
      privateKey: Wallet['address'];
    };
    response: MessageResponse;
  };
  [MessageCode.Delegate]: {
    body: {
      request: DelegateTokensRequest;
      privateKey: Wallet['privateKey'];
    },
    response: MessageResponse;
  };
  [MessageCode.Redelegate]: {
    body: {
      request: RedelegateTokensRequest;
      privateKey: Wallet['privateKey'];
    },
    response: MessageResponse;
  };
  [MessageCode.Undelegate]: {
    body: {
      request: UndelegateTokensRequest;
      privateKey: Wallet['privateKey'];
    },
    response: MessageResponse;
  };
  [MessageCode.WithdrawDelegatorRewards]: {
    body: {
      request: WithdrawDelegatorRewardRequest,
      privateKey: Wallet['privateKey'];
    },
    response: MessageResponse;
  };
  [MessageCode.WithdrawValidatorRewards]: {
    body: {
      request: WithdrawValidatorCommissionRequest,
      privateKey: Wallet['privateKey'];
    },
    response: MessageResponse;
  };
}

export const assertMessageResponseSuccess = (response: MessageResponse): void => {
  if (!response.success) {
    throw response.error;
  }
};
