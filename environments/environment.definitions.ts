export abstract class Environment {
  abstract chainId: string;
  abstract currencyApi: string;
  abstract image: {
    api: string;
    apiKey: string;
  }
  abstract production: boolean;
  abstract rest: {
    local: string;
    remote: string;
  };
  abstract vulcanApi: string;
}
