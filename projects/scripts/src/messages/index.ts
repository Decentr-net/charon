export enum MessageCode {
  Delegate = 'CHARON_DELEGATE',
  Follow = 'CHARON_FOLLOW',
  PostCreate = 'CHARON_POST_CREATE',
  PostDelete = 'CHARON_POST_DELETE',
  PostLike = 'CHARON_POST_LIKE',
  CoinTransfer = 'CHARON_COIN_TRANSFER',
  SendIbcTokens = 'SEND_IBC_TOKENS',
  Location = 'CHARON_LOCATION',
  Redelegate = 'CHARON_REDELEGATE',
  ResetAccount = 'CHARON_RESET_ACCOUNT',
  SentinelSubscribeToNode = 'SENTINEL_SUBSCRIBE_TO_NODE',
  SentinelCancelNodeSubscription = 'SENTINEL_CANCEL_NODE_SUBSCRIPTION',
  SentinelStartSession = 'SENTINEL_START_SESSION',
  SentinelEndSession = 'SENTINEL_END_SESSION',
  Undelegate = 'CHARON_UNDELEGATE',
  Unfollow = 'CHARON_UNFOLLOW',
  WithdrawDelegatorRewards = 'CHARON_WITHDRAW_DELEGATOR_REWARDS',
  WithdrawValidatorRewards = 'CHARON_WITHDRAW_VALIDATOR_REWARDS',
}
