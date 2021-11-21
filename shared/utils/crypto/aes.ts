import { AES, enc } from 'crypto-js';

export const aesEncrypt = (target: string, key: string): string => {
  return AES.encrypt(target, key).toString();
};

export const aesDecrypt = (target: string, key: string): string => {
  return AES.decrypt(target, key).toString(enc.Utf8);
};
