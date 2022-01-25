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

const createDecentrClient = () => new DecentrClient(getApi());

export const createPost = async (
  request: CreatePostRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const communityClient = await createDecentrClient().community();

  return communityClient.createPost(
    request,
    privateKey,
  ).signAndBroadcast();
};

export const deletePost = async (
  request: DeletePostRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const communityClient = await createDecentrClient().community();

  return communityClient.deletePost(
    request,
    privateKey,
  ).signAndBroadcast();
};

export const likePost = async (
  request: LikeRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const communityClient = await createDecentrClient().community();

  return communityClient.setLike(
    request,
    privateKey,
  ).signAndBroadcast();
};

export const follow = async (
  request: FollowRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const communityClient = await createDecentrClient().community();

  return communityClient.follow(
    request,
    privateKey,
  ).signAndBroadcast();
};

export const unfollow = async (
  request: UnfollowRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const communityClient = await createDecentrClient().community();

  return communityClient.unfollow(
    request,
    privateKey,
  ).signAndBroadcast();
};

export const transferCoins = async (
  request: SendTokensRequest,
  privateKey: Wallet['privateKey'],
  memo?: string,
): Promise<DeliverTxResponse> => {
  const bankClient = await createDecentrClient().bank();

  return bankClient.sendTokens(
    request,
    privateKey,
    { memo },
  ).signAndBroadcast();
};

export const resetAccount = async (
  request: ResetAccountRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const operationsClient = await createDecentrClient().operations();

  return operationsClient.resetAccount(
    request,
    privateKey,
  ).signAndBroadcast();
};

export const delegate = async (
  request: DelegateTokensRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const stakingClient = await createDecentrClient().staking();

  return stakingClient.delegateTokens(
    request,
    privateKey,
  ).signAndBroadcast();
};

export const redelegate = async (
  request: RedelegateTokensRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const stakingClient = await createDecentrClient().staking();

  return stakingClient.redelegateTokens(
    request,
    privateKey,
  ).signAndBroadcast();
};

export const undelegate = async (
  request: UndelegateTokensRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const stakingClient = await createDecentrClient().staking();

  return stakingClient.undelegateTokens(
    request,
    privateKey,
  ).signAndBroadcast();
};

export const withdrawDelegatorRewards = async (
  request: WithdrawDelegatorRewardRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const distributionClient = await createDecentrClient().distribution();

  return distributionClient.withdrawDelegatorRewards(
    request,
    privateKey,
  ).signAndBroadcast();
};

export const withdrawValidatorRewards = async (
  request: WithdrawValidatorCommissionRequest,
  privateKey: Wallet['privateKey'],
): Promise<DeliverTxResponse> => {
  const distributionClient = await createDecentrClient().distribution();

  return distributionClient.withdrawValidatorRewards(
    request,
    privateKey,
  ).signAndBroadcast();
};
