export const DENOM_DIVIDER = 1000000;

export enum Denom {
  IBC_UDEC = 'ibc/B1C0DDB14F25279A2026BC8794E12B259F8BDA546A3C5132CCAEE4431CE36783',
  UDVPN = 'udvpn',
}

export const DENOM_MAP: Record<Denom, string> = {
  [Denom.IBC_UDEC]: 'DEC',
  [Denom.UDVPN]: 'DVPN',
};
