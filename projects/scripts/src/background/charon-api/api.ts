import {
  BroadcastResponse,
  Decentr,
  LikeWeight,
  PostCreate,
  PostIdentificationParameters,
  PublicProfile,
  TransferData,
  Wallet
} from 'decentr-js';

import { environment } from '../../../../../environments/environment';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import { UserPrivate } from '../../../../../shared/services/auth';

const networkStorage = new NetworkBrowserStorageService();

const getApi = () => networkStorage.getActiveNetworkInstant().api;

export const createPost = (
  walletAddress: Wallet['address'],
  post: PostCreate,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse> => {
  return new Decentr(getApi(), environment.chainId).createPost(
    walletAddress,
    post,
    {
      broadcast: true,
      privateKey,
    },
  );
};

export const deletePost = (
  walletAddress: Wallet['address'],
  postIdentificationParameters: PostIdentificationParameters,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse> => {
  return new Decentr(getApi(), environment.chainId).deletePost(
    walletAddress,
    postIdentificationParameters,
    {
      broadcast: true,
      privateKey,
    },
  );
};

export const likePost = (
  walletAddress: Wallet['address'],
  postIdentificationParameters: PostIdentificationParameters,
  likeWeight: LikeWeight,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse> => {
  return new Decentr(getApi(), environment.chainId).likePost(
    walletAddress,
    postIdentificationParameters,
    likeWeight,
    {
      broadcast: true,
      privateKey,
    },
  );
};

export const setPublicProfile = (
  walletAddress: Wallet['address'],
  publicProfile: PublicProfile,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse> => {
  return new Decentr(getApi(), environment.chainId).setPublicProfile(
    walletAddress,
    publicProfile,
    {
      broadcast: true,
      privateKey,
    },
  );
};

export const setPrivateProfile = (
  walletAddress: Wallet['address'],
  privateProfile: UserPrivate,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse> => {
  return new Decentr(getApi(), environment.chainId).setPrivateProfile(
    walletAddress,
    privateProfile,
    privateKey,
    {
      broadcast: true,
    },
  );
};

export const transferCoins = (
  transferData: TransferData,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse> => {
  return new Decentr(getApi(), environment.chainId).sendCoin(
    transferData,
    {
      broadcast: true,
      privateKey,
    },
  );
};
