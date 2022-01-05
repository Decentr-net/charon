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

interface TxLog {
  events: TxEvent[];
  msg_index?: number;
}

const parseTxRawLog = (tx: DecodedIndexedTx): TxLog[] | undefined => {
  try {
    return JSON.parse(tx.rawLog);
  } catch {
    return undefined;
  }
};

const getFee = (msgIndex: number, tx: DecodedIndexedTx): number => {
  return msgIndex > 0
    ? 0
    : +tx.tx.authInfo.fee.amount[0].amount;
}

export const mapSendTransaction = (
  msg: TxMessageValue<TxMessageTypeUrl.BankSend>,
  msgIndex: number,
  tx: DecodedIndexedTx,
  type: TxMessageTypeUrl,
  walletAddress: Wallet['address'],
): TokenTransactionMessage => {
  return {
    type,
    amount: (msg.fromAddress === walletAddress ? -1 : 1) * +msg.amount[0].amount,
    comment: tx.tx.body.memo,
    fee: getFee(msgIndex, tx),
    hash: tx.hash,
    recipient: msg.toAddress,
    sender: msg.fromAddress,
    timestamp: tx.height,
  };
}

export const mapDelegateTransaction = (
  msg: TxMessageValue<TxMessageTypeUrl.StakingDelegate>,
  msgIndex: number,
  tx: DecodedIndexedTx,
  type: TxMessageTypeUrl,
  walletAddress: Wallet['address'],
): TokenTransactionMessage[] => {
  const messages = [];

  messages.push({
    type,
    amount: -msg.amount.amount,
    fee: getFee(msgIndex, tx),
    comment: tx.tx.body.memo,
    hash: tx.hash,
    recipient: msg.validatorAddress,
    sender: msg.delegatorAddress,
    timestamp: tx.height,
  });

  const logs = parseTxRawLog(tx);

  const withdrawEvent = logs
    ?.find((log) => (log.msg_index || 0) === msgIndex)
    ?.events
    ?.find((event) => event.type === 'coin_received')

  if (!withdrawEvent) {
    return messages;
  }

  const receiverIndex = withdrawEvent.attributes
    .findIndex((attr) => attr.key === 'receiver' && attr.value === walletAddress);

  if (receiverIndex === -1) {
    return messages;
  }

  const withdrawAmountAttribute = withdrawEvent.attributes[receiverIndex + 1];
  const withdrawAmount = parseInt(withdrawAmountAttribute?.value);

  if (withdrawAmountAttribute?.key !== 'amount' && !withdrawAmount) {
    return messages;
  }

  messages.push({
    type: TxMessageTypeUrl.DistributionWithdrawDelegatorReward,
    amount: withdrawAmount,
    fee: 0,
    comment: '',
    hash: tx.hash,
    recipient: msg.delegatorAddress,
    sender: msg.validatorAddress,
    timestamp: tx.height,
  });

  return messages;
};

export const mapUndelegateTransaction = (
  msg:TxMessageValue<TxMessageTypeUrl.StakingUndelegate>,
  msgIndex: number,
  tx: DecodedIndexedTx,
  type: TxMessageTypeUrl,
  walletAddress: Wallet['address'],
): TokenTransactionMessage[] => {
  const messages = [];

  messages.push({
    type,
    amount: msg.amount.amount,
    fee: getFee(msgIndex, tx),
    comment: tx.tx.body.memo,
    hash: tx.hash,
    recipient: msg.delegatorAddress,
    sender: msg.validatorAddress,
    timestamp: tx.height,
  });

  const logs = parseTxRawLog(tx);

  const withdrawEvent = logs
    ?.find((log) => (log.msg_index || 0) === msgIndex)
    ?.events
    ?.find((event) => event.type === 'coin_received')

  if (!withdrawEvent) {
    return messages;
  }

  const receiverIndex = withdrawEvent.attributes
    .findIndex((attr) => attr.key === 'receiver' && attr.value === walletAddress);

  if (receiverIndex === -1) {
    return messages;
  }

  const withdrawAmountAttribute = withdrawEvent.attributes[receiverIndex + 1];
  const withdrawAmount = parseInt(withdrawAmountAttribute?.value);

  if (withdrawAmountAttribute?.key !== 'amount' && !withdrawAmount) {
    return messages;
  }

  messages.push({
    type: TxMessageTypeUrl.DistributionWithdrawDelegatorReward,
    amount: withdrawAmount,
    fee: 0,
    comment: '',
    hash: tx.hash,
    recipient: msg.delegatorAddress,
    sender: msg.validatorAddress,
    timestamp: tx.height,
  });

  return messages;
};

export const mapWithdrawDelegatorReward = (
  msg: TxMessageValue<TxMessageTypeUrl.DistributionWithdrawDelegatorReward>,
  msgIndex: number,
  tx: DecodedIndexedTx,
  type: TxMessageTypeUrl,
): TokenTransactionMessage | undefined => {
  const logs = parseTxRawLog(tx);

  const amountString = logs
    ?.find((log) => (log.msg_index || 0) === msgIndex)
    ?.events
    ?.find((event) => event.type === 'withdraw_rewards')
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
    fee: getFee(msgIndex, tx),
    comment: tx.tx.body.memo,
    hash: tx.hash,
    recipient: msg.delegatorAddress,
    sender: msg.validatorAddress,
    timestamp: tx.height,
  };
};

// TODO
// export const mapWithdrawValidatorReward = (
//   msg: TxMessageValue<TxMessageTypeUrl.DistributionWithdrawDelegatorReward>,
//   msgIndex: number,
//   tx: DecodedIndexedTx,
//   type: TxMessageTypeUrl,
// ): TokenTransactionMessage | undefined => {
//
//   return {
//     type,
//     amount: msg.amount.amount,
//     fee: getFee(msgIndex, tx),
//     comment: tx.tx.body.memo,
//     hash: tx.hash,
//     recipient: msg.delegatorAddress,
//     sender: msg.validatorAddress,
//     timestamp: tx.height,
//   }
// };

