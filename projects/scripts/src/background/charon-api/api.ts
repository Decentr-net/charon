import { combineLatest, firstValueFrom, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
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
  WithdrawDelegatorRewardRequest,
  WithdrawValidatorCommissionRequest,
} from 'decentr-js';

import { AuthBrowserStorageService } from '../../../../../shared/services/auth';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import { ONE_SECOND } from '../../../../../shared/utils/date';

const decentrClient$: Observable<DecentrClient> = (() => {
  const networkStorage = new NetworkBrowserStorageService();

  const clientSource$ = new ReplaySubject<DecentrClient>(1);

  combineLatest([
    networkStorage.getActiveAPI(),
    new AuthBrowserStorageService().getActiveUser(),
  ]).pipe(
    debounceTime(ONE_SECOND),
    tap(() => clientSource$.next(undefined)),
    switchMap(([api, user]) => DecentrClient.create(api, user?.wallet?.privateKey)),
  ).subscribe(clientSource$);

  return clientSource$.pipe(
    filter(Boolean),
    take(1),
  );
})();

export const createPost = async (
  request: CreatePostRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await firstValueFrom(decentrClient$);

  return decentrClient.community.createPost(
    request,
  ).signAndBroadcast();
};

export const deletePost = async (
  request: DeletePostRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await firstValueFrom(decentrClient$);

  return decentrClient.community.deletePost(
    request,
  ).signAndBroadcast();
};

export const likePost = async (
  request: LikeRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await firstValueFrom(decentrClient$);

  return decentrClient.community.setLike(
    request,
  ).signAndBroadcast();
};

export const follow = async (
  request: FollowRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await firstValueFrom(decentrClient$);

  return decentrClient.community.follow(
    request,
  ).signAndBroadcast();
};

export const unfollow = async (
  request: UnfollowRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await firstValueFrom(decentrClient$);

  return decentrClient.community.unfollow(
    request,
  ).signAndBroadcast();
};

export const transferCoins = async (
  request: SendTokensRequest,
  memo?: string,
): Promise<DeliverTxResponse> => {
  const decentrClient = await firstValueFrom(decentrClient$);

  return decentrClient.bank.sendTokens(
    request,
    { memo },
  ).signAndBroadcast();
};

export const resetAccount = async (
  request: ResetAccountRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await firstValueFrom(decentrClient$);

  return decentrClient.operations.resetAccount(
    request,
  ).signAndBroadcast();
};

export const delegate = async (
  request: DelegateTokensRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await firstValueFrom(decentrClient$);

  return decentrClient.staking.delegateTokens(
    request,
  ).signAndBroadcast();
};

export const redelegate = async (
  request: RedelegateTokensRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await firstValueFrom(decentrClient$);

  return decentrClient.staking.redelegateTokens(
    request,
  ).signAndBroadcast();
};

export const undelegate = async (
  request: UndelegateTokensRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await firstValueFrom(decentrClient$);

  return decentrClient.staking.undelegateTokens(
    request,
  ).signAndBroadcast();
};

export const withdrawDelegatorRewards = async (
  request: WithdrawDelegatorRewardRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await firstValueFrom(decentrClient$);

  return decentrClient.distribution.withdrawDelegatorRewards(
    request,
  ).signAndBroadcast();
};

export const withdrawValidatorRewards = async (
  request: WithdrawValidatorCommissionRequest,
): Promise<DeliverTxResponse> => {
  const decentrClient = await firstValueFrom(decentrClient$);

  return decentrClient.distribution.withdrawValidatorRewards(
    request,
  ).signAndBroadcast();
};
