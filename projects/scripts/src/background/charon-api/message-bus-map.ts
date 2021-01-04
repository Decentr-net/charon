import { LikeWeight, PostCreate, PostIdentificationParameters, PublicProfile, Wallet } from 'decentr-js';

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
}
