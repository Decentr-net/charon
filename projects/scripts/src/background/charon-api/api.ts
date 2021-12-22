import {
  BroadcastTxSuccess,
  CreatePostRequest,
  DecentrClient,
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

import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';

const networkStorage = new NetworkBrowserStorageService();

const getApi = () => networkStorage.getActiveAPIInstant();

const createDecentrClient = () => new DecentrClient(getApi());

export const createPost = async (
  request: CreatePostRequest,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastTxSuccess> => {
  const communityClient = await createDecentrClient().community();

  return communityClient.createPost(
    request,
    privateKey,
  );
};

export const deletePost = async (
  request: DeletePostRequest,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastTxSuccess> => {
  const communityClient = await createDecentrClient().community();

  return communityClient.deletePost(
    request,
    privateKey,
  );
};

export const likePost = async (
  request: LikeRequest,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastTxSuccess> => {
  const communityClient = await createDecentrClient().community();

  return communityClient.setLike(
    request,
    privateKey,
  );
};

export const follow = async (
  request: FollowRequest,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastTxSuccess> => {
  const communityClient = await createDecentrClient().community();

  return communityClient.follow(
    request,
    privateKey,
  );
};

export const unfollow = async (
  request: UnfollowRequest,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastTxSuccess> => {
  const communityClient = await createDecentrClient().community();

  return communityClient.unfollow(
    request,
    privateKey,
  );
};

export const transferCoins = async (
  request: SendTokensRequest,
  privateKey: Wallet['privateKey'],
  memo?: string,
): Promise<BroadcastTxSuccess> => {
  const bankClient = await createDecentrClient().bank();

  return bankClient.sendTokens(
    request,
    privateKey,
    memo,
  );
};

export const resetAccount = async (
  request: ResetAccountRequest,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastTxSuccess> => {
  const operationsClient = await createDecentrClient().operations();

  return operationsClient.resetAccount(
    request,
    privateKey,
  );
};

export const delegate = async (
  request: DelegateTokensRequest,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastTxSuccess> => {
  const stakingClient = await createDecentrClient().staking();

  return stakingClient.delegateTokens(
    request,
    privateKey,
  );
};

export const redelegate = async (
  request: RedelegateTokensRequest,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastTxSuccess> => {
  const stakingClient = await createDecentrClient().staking();

  return stakingClient.redelegateTokens(
    request,
    privateKey,
  );
};

export const undelegate = async (
  request: UndelegateTokensRequest,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastTxSuccess> => {
  const stakingClient = await createDecentrClient().staking();

  return stakingClient.undelegateTokens(
    request,
    privateKey,
  );
};

export const withdrawDelegatorRewards = async (
  request: WithdrawDelegatorRewardRequest,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastTxSuccess> => {
  const distributionClient = await createDecentrClient().distribution();

  return distributionClient.withdrawDelegatorRewards(
    request,
    privateKey,
  );
};

export const withdrawValidatorRewards = async (
  request: WithdrawValidatorCommissionRequest,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastTxSuccess> => {
  const distributionClient = await createDecentrClient().distribution();

  return distributionClient.withdrawValidatorRewards(
    request,
    privateKey,
  );
};
