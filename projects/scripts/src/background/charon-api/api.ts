import { combineLatest, firstValueFrom, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import {
  CreatePostRequest,
  Decimal,
  DelegateTokensRequest,
  DeletePostRequest,
  DeliverTxResponse,
  EndSessionRequest,
  FollowRequest,
  LikeRequest,
  Price,
  RedelegateTokensRequest,
  ResetAccountRequest,
  SendTokensRequest,
  SentinelClient,
  StartSessionRequest,
  SubscribeToNodeRequest,
  UndelegateTokensRequest,
  UnfollowRequest,
  WithdrawDelegatorRewardRequest,
  WithdrawValidatorCommissionRequest,
} from 'decentr-js';

import { getDecentrClient } from '../client';
import CONFIG_SERVICE from '../config';
import { AuthBrowserStorageService } from '@shared/services/auth';
import { ONE_SECOND } from '@shared/utils/date';
import { DEFAULT_DENOM } from '@shared/models/sentinel';

const sentinelClient$: Observable<SentinelClient> = (() => {
  const clientSource$ = new ReplaySubject<SentinelClient>(1);

  combineLatest([
    CONFIG_SERVICE.getVpnUrl(),
    new AuthBrowserStorageService().getActiveUser(),
  ]).pipe(
    debounceTime(ONE_SECOND),
    tap(() => clientSource$.next(undefined)),
    switchMap(([api, user]) => SentinelClient.create(api, {
      gasPrice: new Price(Decimal.fromUserInput('1.7', 6), DEFAULT_DENOM),
      privateKey: user?.wallet?.privateKey,
    })),
  ).subscribe(clientSource$);

  return clientSource$.pipe(
    filter(Boolean),
    take(1),
  );
})();

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

export const sentinelSubscribeToNode = async (
  request: SubscribeToNodeRequest,
): Promise<DeliverTxResponse> => {
  const sentinelClient = await firstValueFrom(sentinelClient$);

  return sentinelClient.subscription.subscribeToNode(
    request,
  ).signAndBroadcast();
};

export const sentinelStartSession = async (
  request: StartSessionRequest,
): Promise<DeliverTxResponse> => {
  const sentinelClient = await firstValueFrom(sentinelClient$);

  return sentinelClient.session.startSession(
    request,
  ).signAndBroadcast();
};

export const sentinelEndSession = async (
  request: EndSessionRequest,
): Promise<DeliverTxResponse> => {
  const sentinelClient = await firstValueFrom(sentinelClient$);

  return sentinelClient.session.endSession(
    request,
  ).signAndBroadcast();
};
