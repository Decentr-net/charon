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
};

const getWithdrawMessages = (
  tx: DecodedIndexedTx,
  msgIndex: number,
  walletAddress: Wallet['address'],
): TokenTransactionMessage[] => {
  const logs = parseTxRawLog(tx);

  const withdrawEvent = logs
    ?.find((log) => (log.msg_index || 0) === msgIndex)
    ?.events
    ?.find((event) => event.type === 'transfer');

  if (!withdrawEvent) {
    return [];
  }

  const transfers = withdrawEvent.attributes
    .reduce((acc, attribute, index, attributes) => {
      const senderAttribute = attributes[index + 1];
      const amountAttribute = attributes[index + 2];

      if (
        attribute.key === 'recipient'
        && attribute.value === walletAddress
        && senderAttribute?.key === 'sender'
        && amountAttribute?.key === 'amount'
      ) {
        const amount = parseFloat(amountAttribute.value).toString();

        return [
          ...acc,
          {
            sender: senderAttribute.value,
            amount,
          },
        ];
      }

      return acc;
    }, []);

  return transfers.map((transfer) => ({
    type: TxMessageTypeUrl.DistributionWithdrawDelegatorReward,
    amount: transfer.amount,
    fee: 0,
    comment: '',
    hash: tx.hash,
    recipient: walletAddress,
    sender: transfer.sender,
    height: tx.height,
  }));
};

export const mapSendTransaction = (
  msg: TxMessageValue<TxMessageTypeUrl.BankSend>,
  msgIndex: number,
  tx: DecodedIndexedTx,
  walletAddress: Wallet['address'],
): TokenTransactionMessage => {
  const amount = (msg.fromAddress === walletAddress ? -1 : 1) * +msg.amount[0].amount;

  return {
    type: TxMessageTypeUrl.BankSend,
    amount,
    comment: tx.tx.body.memo,
    fee: amount < 0 ? getFee(msgIndex, tx) : 0,
    hash: tx.hash,
    recipient: msg.toAddress,
    sender: msg.fromAddress,
    height: tx.height,
  };
}

export const mapDelegateTransaction = (
  msg: TxMessageValue<TxMessageTypeUrl.StakingDelegate>,
  msgIndex: number,
  tx: DecodedIndexedTx,
  walletAddress: Wallet['address'],
): TokenTransactionMessage[] => {
  return [
    {
      type: TxMessageTypeUrl.StakingDelegate,
      amount: -msg.amount.amount,
      fee: getFee(msgIndex, tx),
      comment: tx.tx.body.memo,
      hash: tx.hash,
      recipient: msg.validatorAddress,
      sender: msg.delegatorAddress,
      height: tx.height,
    },
    ...getWithdrawMessages(tx, msgIndex, walletAddress),
  ];
};

export const mapUndelegateTransaction = (
  msg: TxMessageValue<TxMessageTypeUrl.StakingUndelegate>,
  msgIndex: number,
  tx: DecodedIndexedTx,
  walletAddress: Wallet['address'],
): TokenTransactionMessage[] => {
  return [
    {
      type: TxMessageTypeUrl.StakingUndelegate,
      amount: msg.amount.amount,
      fee: 0,
      comment: tx.tx.body.memo,
      hash: tx.hash,
      recipient: msg.delegatorAddress,
      sender: msg.validatorAddress,
      height: tx.height,
    },
    ...getWithdrawMessages(tx, msgIndex, walletAddress),
  ];
};

export const mapRedelegateTransaction = (
  msgIndex: number,
  tx: DecodedIndexedTx,
  walletAddress: Wallet['address'],
): TokenTransactionMessage[] => {
  return getWithdrawMessages(tx, msgIndex, walletAddress);
};

export const mapWithdrawDelegatorReward = (
  msgIndex: number,
  tx: DecodedIndexedTx,
  walletAddress: Wallet['address'],
): TokenTransactionMessage[] => {
  return getWithdrawMessages(tx, msgIndex, walletAddress);
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

