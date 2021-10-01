type BlockchainId = string;
type CurrencyId = string;

export type CoinRateResponse = Record<BlockchainId, Record<CurrencyId, number>>;

export interface CoinRateHistoryResponse {
  prices: [number, number][];
}
