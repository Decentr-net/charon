import { DecodedIndexedTx, TxMessageTypeUrl, TxMessageValue, Wallet } from 'decentr-js';
import { TokenTransactionMessage } from '../../components/token-transactions-table';

export const mapSendTransaction = (
  msg: TxMessageValue<TxMessageTypeUrl.BankSend>,
  tx: DecodedIndexedTx,
  type: TxMessageTypeUrl,
  walletAddress: Wallet['address'],
): TokenTransactionMessage => {
  return {
    amount: (msg.fromAddress === walletAddress ? 1 : -1) * +msg.amount[0].amount,
    comment: tx.tx.body.memo,
    fee: tx.tx.authInfo.fee.amount[0].amount,
    hash: tx.hash,
    recipient: msg.toAddress,
    sender: msg.fromAddress,
    timestamp: Math.random() * 12345678,
    type,
  };
}

// export const mapWithdrawTransaction = (
//   msg: TxMessageValue<TxMessageTypeUrl.DistributionWithdrawDelegatorReward>
//     | TxMessageValue<TxMessageTypeUrl.StakingBeginRedelegate>
//     | TxMessageValue<TxMessageTypeUrl.StakingDelegate>
//     | TxMessageValue<TxMessageTypeUrl.StakingUndelegate>,
//   tx: DecodedIndexedTx,
//   type: TxMessageTypeUrl,
//   walletAddress: Wallet['address'],
// ): TokenTransactionMessage => {
//   const txValue = tx.tx.value;
//
//   const amountString = logEvents
//     .find((event) => event.type === 'transfer')?.attributes
//     .find((attribute) => attribute.key === 'amount')?.value;
//
//   if (!amountString) {
//     return undefined;
//   }
//
//   const amount = {
//     amount: parseFloat(amountString).toString(),
//     denom: amountString.replace(/[^0-9]/g, ''),
//   };
//
//   return {
//     amount,
//     fee,
//     type,
//     comment: txValue.memo,
//     hash: tx.txhash,
//     recipient: msg.value.delegator_address,
//     sender: msg.value.validator_address,
//     timestamp: new Date(tx.timestamp).valueOf(),
//   };
// }
