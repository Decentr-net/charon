export enum MessageType {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  IS_WG_INSTALLED = 'isWgInstalled',
  STATUS = 'status',
  WG_INSTALL = 'wgInstall',
}

export interface ConnectParamsRequest {
  ipV4: string;
  ipV6: string;
  host: string;
  port: number;
  hostPublicKey: string;
  wgPrivateKey: string;
  address: string;
  sessionId: number;
  nodeAddress: string;
}

export interface StatusResponse {
  address: string;
  interface: string;
  nodeAddress: string;
  sessionId: number;
}

export interface ConnectMessage {
  type: MessageType.CONNECT;
  params: ConnectParamsRequest;
}

export interface DisconnectMessage {
  type: MessageType.DISCONNECT;
}

export interface StatusMessage {
  type: MessageType.STATUS;
}

export interface IsWgInstalledMessage {
  type: MessageType.IS_WG_INSTALLED;
}

export interface WgInstallMessage {
  type: MessageType.WG_INSTALL;
}

export type Message = ConnectMessage | DisconnectMessage | StatusMessage | IsWgInstalledMessage | WgInstallMessage;

export type MessageResponse<T> = {
  result: boolean;
  response: T;
};

export type ConnectMessageResponse = MessageResponse<StatusResponse>;

export type DisconnectMessageResponse = MessageResponse<void>;

export type StatusMessageResponse = MessageResponse<StatusResponse>;

export type IsWgInstalledResponse = MessageResponse<void>;

export type WgInstallResponse = MessageResponse<void>;
