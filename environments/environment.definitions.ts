export abstract class Environment {
  abstract config: string;
  abstract currencyApi: string;
  abstract production: boolean;
}
