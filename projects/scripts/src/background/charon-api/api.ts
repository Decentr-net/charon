import {
  CreatePostRequest,
  DecentrClient,
  DelegateTokensRequest,
  DeletePostRequest,
  DeliverTxResponse,
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

import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';

const networkStorage = new NetworkBrowserStorageService();

const getApi = () => networkStorage.getActiveAPIInstant();

const createDecentrClient = async (privateKey: Wallet['privateKey']) => DecentrClient.create(getApi(), privateKey);

export const createPost = async (
  request: CreatePostRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const decentrClient = await createDecentrClient(privateKey);

  return decentrClient.community.createPost(
    request,
  ).signAndBroadcast();
};

export const deletePost = async (
  request: DeletePostRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const decentrClient = await createDecentrClient(privateKey);

  return decentrClient.community.deletePost(
    request,
  ).signAndBroadcast();
};

export const likePost = async (
  request: LikeRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const decentrClient = await createDecentrClient(privateKey);

  return decentrClient.community.setLike(
    request,
  ).signAndBroadcast();
};

export const follow = async (
  request: FollowRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const decentrClient = await createDecentrClient(privateKey);

  return decentrClient.community.follow(
    request,
  ).signAndBroadcast();
};

export const unfollow = async (
  request: UnfollowRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const decentrClient = await createDecentrClient(privateKey);

  return decentrClient.community.unfollow(
    request,
  ).signAndBroadcast();
};

export const transferCoins = async (
  request: SendTokensRequest,
  privateKey: Wallet['privateKey'],
  memo?: string,
): Promise<DeliverTxResponse> => {
  const decentrClient = await createDecentrClient(privateKey);

  return decentrClient.bank.sendTokens(
    request,
    { memo },
  ).signAndBroadcast();
};

export const resetAccount = async (
  request: ResetAccountRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const decentrClient = await createDecentrClient(privateKey);

  return decentrClient.operations.resetAccount(
    request,
  ).signAndBroadcast();
};

export const delegate = async (
  request: DelegateTokensRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const decentrClient = await createDecentrClient(privateKey);

  return decentrClient.staking.delegateTokens(
    request,
  ).signAndBroadcast();
};

export const redelegate = async (
  request: RedelegateTokensRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const decentrClient = await createDecentrClient(privateKey);

  return decentrClient.staking.redelegateTokens(
    request,
  ).signAndBroadcast();
};

export const undelegate = async (
  request: UndelegateTokensRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const decentrClient = await createDecentrClient(privateKey);

  return decentrClient.staking.undelegateTokens(
    request,
  ).signAndBroadcast();
};

export const withdrawDelegatorRewards = async (
  request: WithdrawDelegatorRewardRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const decentrClient = await createDecentrClient(privateKey);

  return decentrClient.distribution.withdrawDelegatorRewards(
    request,
  ).signAndBroadcast();
};

export const withdrawValidatorRewards = async (
  request: WithdrawValidatorCommissionRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const decentrClient = await createDecentrClient(privateKey);

  return decentrClient.distribution.withdrawValidatorRewards(
    request,
  ).signAndBroadcast();
};
