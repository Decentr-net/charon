import {
  BroadcastResponse,
  Decentr,
  LikeWeight,
  PostCreate,
  PostIdentificationParameters,
  StdTxMessageType,
  TransferData,
  Validator,
  Wallet,
} from 'decentr-js';
import { mergeMap } from 'rxjs/operators';

import CONFIG_SERVICE from '../config';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';

const configService = CONFIG_SERVICE;
const networkStorage = new NetworkBrowserStorageService();

const DENOM = 'udec';

const getApi = () => networkStorage.getActiveAPIInstant();

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
};

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
};

export const resetAccount = (
  walletAddress: Wallet['address'],
  initiator: Wallet['address'],
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse<StdTxMessageType.OperationsResetAccount>> => {
  return configService.getChainId().pipe(
    mergeMap((chainId) => new Decentr(getApi(), chainId).operations.resetAccount(
      walletAddress,
      initiator,
      {
        broadcast: true,
        privateKey,
      },
    )),
  ).toPromise();
};

export const delegate = (
  walletAddress: Wallet['address'],
  validatorAddress: Validator['operator_address'],
  amount: string,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse<StdTxMessageType.CosmosDelegate>> => {
  return configService.getChainId().pipe(
    mergeMap((chainId) => new Decentr(getApi(), chainId).staking.createDelegation(
      {
        delegator_address: walletAddress,
        validator_address: validatorAddress,
        amount: {
          amount,
          denom: DENOM,
        },
      },
      {
        broadcast: true,
        privateKey,
      },
    )),
  ).toPromise();
};

export const redelegate = (
  walletAddress: Wallet['address'],
  fromValidatorAddress: Validator['operator_address'],
  toValidatorAddress: Validator['operator_address'],
  amount: string,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse<StdTxMessageType.CosmosBeginRedelegate>> => {
  return configService.getChainId().pipe(
    mergeMap((chainId) => new Decentr(getApi(), chainId).staking.createRedelegation(
      {
        delegator_address: walletAddress,
        validator_src_address: fromValidatorAddress,
        validator_dst_address: toValidatorAddress,
        amount: {
          amount,
          denom: DENOM,
        },
      },
      {
        broadcast: true,
        privateKey,
      },
    )),
  ).toPromise();
};

export const undelegate = (
  walletAddress: Wallet['address'],
  validatorAddress: Validator['operator_address'],
  amount: string,
  privateKey: Wallet['privateKey'],
): Promise<BroadcastResponse<StdTxMessageType.CosmosUndelegate>> => {
  return configService.getChainId().pipe(
    mergeMap((chainId) => new Decentr(getApi(), chainId).staking.createUnbondingDelegation(
      {
        delegator_address: walletAddress,
        validator_address: validatorAddress,
        amount: {
          amount,
          denom: DENOM,
        },
      },
      {
        broadcast: true,
        privateKey,
      },
    )),
  ).toPromise();
};

export const withdrawDelegatorRewards = (
  privateKey: Wallet['privateKey'],
  validatorAddress: Validator['operator_address'],
  walletAddress: Wallet['address'],
): Promise<BroadcastResponse<StdTxMessageType.CosmosWithdrawDelegationReward>> => {
  return configService.getChainId().pipe(
    mergeMap((chainId) => new Decentr(getApi(), chainId).distribution.withdrawDelegatorRewards(
      walletAddress,
      {
        broadcast: true,
        fromValidatorAddress: validatorAddress,
        privateKey,
      }
    )),
  ).toPromise();
};

export const withdrawValidatorRewards = (
  privateKey: Wallet['privateKey'],
  validatorAddress: Validator['operator_address'],
  walletAddress: Wallet['address'],
): Promise<BroadcastResponse<StdTxMessageType.CosmosWithdrawDelegationReward>> => {
  return configService.getChainId().pipe(
    mergeMap((chainId) => new Decentr(getApi(), chainId).distribution.withdrawValidatorRewards(
      walletAddress,
      validatorAddress,
      {
        broadcast: true,
        privateKey,
      }
    )),
  ).toPromise();
};
