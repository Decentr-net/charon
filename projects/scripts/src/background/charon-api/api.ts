import {
  BroadcastResponse,
  Decentr,
  LikeWeight,
  PostCreate,
  PostIdentificationParameters,
  StdTxMessageType,
  TransferData,
  Wallet,
} from 'decentr-js';
import { mergeMap } from 'rxjs/operators';

import CONFIG_SERVICE from '../config';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';

const configService = CONFIG_SERVICE;
const networkStorage = new NetworkBrowserStorageService();

const getApi = () => networkStorage.getActiveNetworkInstant().api;

export const createPost = (
  walletAddress: Wallet['address'],
  post: PostCreate,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse<StdTxMessageType.CommunityCreatePost>> => {
  return configService.getChainId().pipe(
    mergeMap((chainId) => new Decentr(getApi(), chainId).community.createPost(
      walletAddress,
      post,
      {
        broadcast: true,
        privateKey,
      },
    )),
  ).toPromise();
};

export const deletePost = (
  walletAddress: Wallet['address'],
  postIdentificationParameters: PostIdentificationParameters,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse<StdTxMessageType.CommunityDeletePost>> => {
  return configService.getChainId().pipe(
    mergeMap((chainId) => new Decentr(getApi(), chainId).community.deletePost(
      walletAddress,
      postIdentificationParameters,
      {
        broadcast: true,
        privateKey,
      },
    )),
  ).toPromise();
};

export const likePost = (
  walletAddress: Wallet['address'],
  postIdentificationParameters: PostIdentificationParameters,
  likeWeight: LikeWeight,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse<StdTxMessageType.CommunitySetLike>> => {
  return configService.getChainId().pipe(
    mergeMap((chainId) => new Decentr(getApi(), chainId).community.likePost(
      walletAddress,
      postIdentificationParameters,
      likeWeight,
      {
        broadcast: true,
        privateKey,
      },
    )),
  ).toPromise();
};

export const transferCoins = (
  transferData: TransferData,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse<StdTxMessageType.CosmosSend>> => {
  return configService.getChainId().pipe(
    mergeMap((chainId) => new Decentr(getApi(), chainId).bank.sendCoin(
      transferData,
      {
        broadcast: true,
        privateKey,
      },
    )),
  ).toPromise();
};

export const follow = (
  follower: Wallet['address'],
  whom: Wallet['address'],
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse<StdTxMessageType.CommunityFollow>> => {
  return configService.getChainId().pipe(
    mergeMap((chainId) => new Decentr(getApi(), chainId).community.follow(
      follower,
      whom,
      {
        broadcast: true,
        privateKey,
      },
    )),
  ).toPromise();
}

export const unfollow = (
  follower: Wallet['address'],
  whom: Wallet['address'],
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse<StdTxMessageType.CommunityUnfollow>> => {
  return configService.getChainId().pipe(
    mergeMap((chainId) => new Decentr(getApi(), chainId).community.unfollow(
      follower,
      whom,
      {
        broadcast: true,
        privateKey,
      },
    )),
  ).toPromise();
}
