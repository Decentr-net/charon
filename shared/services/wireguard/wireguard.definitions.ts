// TODO: add props for status.json
export interface HostConnectRequest {
  ipV4: string;
  ipV6: string;
  host: string;
  port: number;
  hostPublicKey: string;
  wgPrivateKey: string;
}
