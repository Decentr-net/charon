import {
  CreatePostRequest,
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
  WithdrawDelegatorRewardRequest,
  WithdrawValidatorCommissionRequest,
} from 'decentr-js';

import { getDecentrClient } from '../client';

export const createPost = async (
  request: CreatePostRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.community.createPost(
    request,
  ).signAndBroadcast();
};

export const deletePost = async (
  request: DeletePostRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.community.deletePost(
    request,
  ).signAndBroadcast();
};

export const likePost = async (
  request: LikeRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.community.setLike(
    request,
  ).signAndBroadcast();
};

export const follow = async (
  request: FollowRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.community.follow(
    request,
  ).signAndBroadcast();
};

export const unfollow = async (
  request: UnfollowRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.community.unfollow(
    request,
  ).signAndBroadcast();
};

export const transferCoins = async (
  request: SendTokensRequest,
  memo?: string,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.bank.sendTokens(
    request,
  ).signAndBroadcast(memo);
};

export const resetAccount = async (
  request: ResetAccountRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.operations.resetAccount(
    request,
  ).signAndBroadcast();
};

export const delegate = async (
  request: DelegateTokensRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.staking.delegateTokens(
    request,
  ).signAndBroadcast();
};

export const redelegate = async (
  request: RedelegateTokensRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.staking.redelegateTokens(
    request,
  ).signAndBroadcast();
};

export const undelegate = async (
  request: UndelegateTokensRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.staking.undelegateTokens(
    request,
  ).signAndBroadcast();
};

export const withdrawDelegatorRewards = async (
  request: WithdrawDelegatorRewardRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.distribution.withdrawDelegatorRewards(
    request,
  ).signAndBroadcast();
};

export const withdrawValidatorRewards = async (
  request: WithdrawValidatorCommissionRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.distribution.withdrawValidatorRewards(
    request,
  ).signAndBroadcast();
};
