import { DecodedIndexedTx, TxMessageTypeUrl, TxMessageValue, Wallet } from 'decentr-js';

import { TokenTransactionMessage } from '../../components/token-transactions-table';

interface TxEventAttribute {
  key: string;
  value: string;
}

interface TxEvent {
  type: string;
  attributes: TxEventAttribute[];
}

const parseTxRawLog = (tx: DecodedIndexedTx): TxEvent[] | undefined => {
  try {
    return JSON.parse(tx.rawLog)[0].events;
  } catch {
    return undefined;
  }
};

export const mapSendTransaction = (
  msg: TxMessageValue<TxMessageTypeUrl.BankSend>,
  tx: DecodedIndexedTx,
  type: TxMessageTypeUrl,
  walletAddress: Wallet['address'],
): TokenTransactionMessage => {
  return {
    type,
    amount: (msg.fromAddress === walletAddress ? -1 : 1) * +msg.amount[0].amount,
    comment: tx.tx.body.memo,
    fee: tx.tx.authInfo.fee.amount[0].amount,
    hash: tx.hash,
    recipient: msg.toAddress,
    sender: msg.fromAddress,
    timestamp: tx.height,
  };
}

export const mapDelegateTransaction = (
  msg:TxMessageValue<TxMessageTypeUrl.StakingDelegate>,
  tx: DecodedIndexedTx,
  type: TxMessageTypeUrl,
): TokenTransactionMessage => {
  return {
    type,
    amount: -msg.amount.amount,
    fee: tx.tx.authInfo.fee.amount[0].amount,
    comment: tx.tx.body.memo,
    hash: tx.hash,
    recipient: msg.validatorAddress,
    sender: msg.delegatorAddress,
    timestamp: tx.height,
  };
};

export const mapUndelegateTransaction = (
  msg:TxMessageValue<TxMessageTypeUrl.StakingUndelegate>,
  tx: DecodedIndexedTx,
  type: TxMessageTypeUrl,
): TokenTransactionMessage => {
  return {
    type,
    amount: msg.amount.amount,
    fee: tx.tx.authInfo.fee.amount[0].amount,
    comment: tx.tx.body.memo,
    hash: tx.hash,
    recipient: msg.delegatorAddress,
    sender: msg.validatorAddress,
    timestamp: tx.height,
  };
};

export const mapWithdrawDelegatorReward = (
  msg:TxMessageValue<TxMessageTypeUrl.DistributionWithdrawDelegatorReward>,
  tx: DecodedIndexedTx,
  type: TxMessageTypeUrl,
): TokenTransactionMessage | undefined => {
  const events = parseTxRawLog(tx);

  if (!events) {
    return;
  }

  const amountString = events
    .find((event) => event.type === 'withdraw_rewards')
    ?.attributes
    ?.find((attr) => attr.key === 'amount')
    ?.value;

  const amount = parseInt(amountString);

  if (!amount) {
    return;
  }

  return {
    type,
    amount,
    fee: tx.tx.authInfo.fee.amount[0].amount,
    comment: tx.tx.body.memo,
    hash: tx.hash,
    recipient: msg.delegatorAddress,
    sender: msg.validatorAddress,
    timestamp: tx.height,
  };
};
