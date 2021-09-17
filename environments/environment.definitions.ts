export abstract class Environment {
  abstract config: string;
  abstract currencyApi: string;
  abstract image: {
    api: string;
    apiKey: string;
  };
  abstract production: boolean;
}
