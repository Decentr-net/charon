export abstract class Environment {
  chainId: string;
  currencyApi: string;
  production: boolean;
  rest: {
    local: string;
    remote: string;
  };
  vulcanApi: string;
}
