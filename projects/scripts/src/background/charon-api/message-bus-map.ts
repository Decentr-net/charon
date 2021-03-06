import {
  LikeWeight,
  PostCreate,
  PostIdentificationParameters,
  PublicProfile,
  StdTxMessageType,
  StdTxMessageValue,
  TransferData,
  Wallet,
} from 'decentr-js';

import { MessageMap } from '../../../../../shared/message-bus';
import { UserPrivate } from '../../../../../shared/services/auth';
import { MessageCode } from '../../messages';

export interface CharonAPIMessageBusMap extends MessageMap {
  [MessageCode.PostCreate]: {
    body: {
      walletAddress: Wallet['address'];
      post: PostCreate;
      privateKey: Wallet['privateKey'];
    };
    response: {
      success: boolean;
      error?: any;
      messageValue?: StdTxMessageValue<StdTxMessageType.CommunityCreatePost>;
    };
  };
  [MessageCode.PostDelete]: {
    body: {
      walletAddress: Wallet['address'];
      postIdentificationParameters: PostIdentificationParameters;
      privateKey: Wallet['privateKey'];
    };
    response: {
      success: boolean;
      error?: any;
    };
  };
  [MessageCode.PostLike]: {
    body: {
      walletAddress: Wallet['address'];
      postIdentificationParameters: PostIdentificationParameters;
      likeWeight: LikeWeight;
      privateKey: Wallet['privateKey'];
    };
    response: {
      success: boolean;
      error?: any;
    };
  };
  [MessageCode.PrivateProfileUpdate]: {
    body: {
      walletAddress: Wallet['address'];
      privateProfile: UserPrivate;
      privateKey: Wallet['privateKey'];
    };
    response: {
      success: boolean;
      error?: any;
    };
  };
  [MessageCode.PublicProfileUpdate]: {
    body: {
      publicProfile: PublicProfile;
      walletAddress: Wallet['address'];
      privateKey: Wallet['privateKey'];
    };
    response: {
      success: boolean;
      error?: any;
    };
  };
  [MessageCode.CoinTransfer]: {
    body: {
      transferData: TransferData;
      privateKey: Wallet['privateKey'];
    };
    response: {
      success: boolean;
      error?: any;
    };
  };
  [MessageCode.Follow]: {
    body: {
      follower: Wallet['address'];
      whom: Wallet['address'];
      privateKey: Wallet['address'];
    };
    response: {
      success: boolean;
      error?: any;
    };
  };
  [MessageCode.Unfollow]: {
    body: {
      follower: Wallet['address'];
      whom: Wallet['address'];
      privateKey: Wallet['address'];
    };
    response: {
      success: boolean;
      error?: any;
    };
  }
}
