import {
  CancelSubscriptionRequest,
  CreatePostRequest,
  DelegateTokensRequest,
  DeletePostRequest,
  DeliverTxResponse,
  EndSessionRequest,
  FollowRequest,
  LikeRequest,
  RedelegateTokensRequest,
  ResetAccountRequest,
  SendIbcTokensRequest,
  SendTokensRequest,
  SubscribeToNodeRequest,
  UndelegateTokensRequest,
  UnfollowRequest,
  WithdrawDelegatorRewardRequest,
  WithdrawValidatorCommissionRequest,
} from 'decentr-js';

import { getDecentrClient, getSentinelClient } from '../client';
import { EndStartSessionRequest } from './message-bus-map';

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

export const sendIbcTokens = async (
  request: SendIbcTokensRequest,
  memo?: string,
): Promise<DeliverTxResponse> => {
  const decentrClient = await getDecentrClient();

  return decentrClient.bank.sendIbcTokens(
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

export const sentinelSubscribeToNode = async (
  request: SubscribeToNodeRequest,
): Promise<DeliverTxResponse> => {
  const sentinelClient = await getSentinelClient();

  return sentinelClient.subscription.subscribeToNode(
    request,
  ).signAndBroadcast();
};

export const sentinelCancelNodeSubscription = async (
  request: CancelSubscriptionRequest,
): Promise<DeliverTxResponse> => {
  const sentinelClient = await getSentinelClient();

  return sentinelClient.subscription.cancelSubscription(
    request,
  ).signAndBroadcast();
};

export const sentinelStartSession = async (
  request: EndStartSessionRequest,
): Promise<DeliverTxResponse> => {
  const sentinelClient = await getSentinelClient();

  const endSessionMessage = sentinelClient.session.endSession(request.endSession);
  const startSessionMessage = sentinelClient.session.startSession(request.startSession);
  const tx = endSessionMessage.concat(startSessionMessage);

  return tx.signAndBroadcast();
};

export const sentinelEndSession = async (
  request: EndSessionRequest,
): Promise<DeliverTxResponse> => {
  const sentinelClient = await getSentinelClient();

  return sentinelClient.session.endSession(
    request,
  ).signAndBroadcast();
};
