import { DecodedIndexedTx, CosmosTxMessageTypeUrl, TxMessageValue, Wallet } from 'decentr-js';

import { TokenTransactionMessage } from '../../components';

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

const getWithdrawMessages = (
  tx: DecodedIndexedTx,
  msgIndex: number,
  walletAddress: Wallet['address'],
): Omit<TokenTransactionMessage, 'type'>[] => {
  const logs = parseTxRawLog(tx);

  const events = logs
    ?.find((log) => (log.msg_index || 0) === msgIndex)
    ?.events;

  const transferEvent = events
    ?.find((event) => event.type === 'transfer');

  if (!transferEvent) {
    const validator = events
      ?.find((event) => event.type === 'withdraw_rewards')
      ?.attributes
      ?.find((attribute) => attribute.key === 'validator')
      ?.value;

    if (!validator) {
      return [];
    }

    return [{
      amount: 0,
      recipient: walletAddress,
      sender: validator,
    }];
  }

  const transfers = transferEvent.attributes
    .reduce((acc, attribute, index, attributes) => {
      const senderAttribute = attributes[index + 1];
      const amountAttribute = attributes[index + 2];

      if (
        attribute.key === 'recipient'
        && attribute.value === walletAddress
        && senderAttribute?.key === 'sender'
        && amountAttribute?.key === 'amount'
      ) {
        const amount = parseFloat(amountAttribute.value);

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
    amount: transfer.amount,
    recipient: walletAddress,
    sender: transfer.sender,
  }));
};

export const mapSendTransaction = (
  msg: TxMessageValue<CosmosTxMessageTypeUrl.BankSend>,
  walletAddress: Wallet['address'],
): TokenTransactionMessage => {
  const amount = (msg.fromAddress === walletAddress ? -1 : 1) * +msg.amount[0].amount;

  return {
    type: CosmosTxMessageTypeUrl.BankSend,
    amount,
    recipient: msg.toAddress,
    sender: msg.fromAddress,
  };
};

export const mapIbcTransfer = (
  msg: TxMessageValue<CosmosTxMessageTypeUrl.IbcMsgTransfer>,
): TokenTransactionMessage => {
  const amount = -1 * +msg.token.amount;

  return {
    type: CosmosTxMessageTypeUrl.BankSend,
    amount,
    recipient: msg.receiver,
    sender: msg.sender,
  };
};

export const mapDelegateTransaction = (
  msg: TxMessageValue<CosmosTxMessageTypeUrl.StakingDelegate>,
  msgIndex: number,
  tx: DecodedIndexedTx,
  walletAddress: Wallet['address'],
): TokenTransactionMessage[] => {
  return [
    {
      type: CosmosTxMessageTypeUrl.StakingDelegate,
      amount: -msg.amount.amount,
      recipient: msg.validatorAddress,
      sender: msg.delegatorAddress,
    },
    ...getWithdrawMessages(tx, msgIndex, walletAddress).map((withdrawMsg) => ({
      ...withdrawMsg,
      type: CosmosTxMessageTypeUrl.DistributionWithdrawDelegatorReward,
    })),
  ];
};

export const mapUndelegateTransaction = (
  msg: TxMessageValue<CosmosTxMessageTypeUrl.StakingUndelegate>,
  msgIndex: number,
  tx: DecodedIndexedTx,
  walletAddress: Wallet['address'],
): TokenTransactionMessage[] => {
  return [
    {
      type: CosmosTxMessageTypeUrl.StakingUndelegate,
      amount: +msg.amount.amount,
      recipient: msg.delegatorAddress,
      sender: msg.validatorAddress,
    },
    ...getWithdrawMessages(tx, msgIndex, walletAddress).map((withdrawMsg) => ({
      ...withdrawMsg,
      type: CosmosTxMessageTypeUrl.DistributionWithdrawDelegatorReward,
    })),
  ];
};

export const mapRedelegateTransaction = (
  msgIndex: number,
  tx: DecodedIndexedTx,
  walletAddress: Wallet['address'],
): TokenTransactionMessage[] => {
  return getWithdrawMessages(tx, msgIndex, walletAddress).map((msg) => ({
    ...msg,
    type: CosmosTxMessageTypeUrl.DistributionWithdrawDelegatorReward,
  }));
};

export const mapWithdrawDelegatorReward = (
  msgIndex: number,
  tx: DecodedIndexedTx,
  walletAddress: Wallet['address'],
): TokenTransactionMessage[] => {
  return getWithdrawMessages(tx, msgIndex, walletAddress).map((msg) => ({
    ...msg,
    type: CosmosTxMessageTypeUrl.DistributionWithdrawDelegatorReward,
  }));
};

export const mapWithdrawValidatorRewardTransaction = (
  msgIndex: number,
  tx: DecodedIndexedTx,
  walletAddress: Wallet['address'],
): TokenTransactionMessage[] => {
  return getWithdrawMessages(tx, msgIndex, walletAddress).map((msg) => ({
    ...msg,
    type: CosmosTxMessageTypeUrl.DistributionWithdrawValidatorCommission,
  }));
};

