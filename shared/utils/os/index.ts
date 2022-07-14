export enum OsType {
  Linux = 'linux',
  Mac = 'mac',
  Windows = 'windows',
  Unknown = 'unknown',
}

export const detectOs = (): OsType => {
  const userAgent = window.navigator.userAgent;

  if (userAgent.indexOf('Windows') > -1) {
    return OsType.Windows;
  }

  if (userAgent.indexOf('Mac') > -1) {
    return OsType.Mac;
  }

  if (userAgent.indexOf('X11') > -1) {
    return OsType.Linux;
  }

  if (userAgent.indexOf('Linux') > -1) {
    return OsType.Linux;
  }

  return OsType.Unknown;
};
