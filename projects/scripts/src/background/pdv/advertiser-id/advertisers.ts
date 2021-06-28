interface AdvertisersConfig {
  cookieRegex: RegExp[];
  domainRegex: RegExp;
}

enum Advertisers {
  Amazon = 'amazon',
  Apple = 'apple',
  Facebook = 'facebook',
  Google = 'google',
  Microsoft = 'microsoft',
  Vk = 'vk',
}

const createUrlRegex = (advertiser: string): RegExp => new RegExp(`^(www\.)?(\.)?${advertiser}(\.[a-z]{2,})`);

const ADVERTISERS_CONFIGURATION: Record<Advertisers, AdvertisersConfig> = {
  [Advertisers.Amazon]: {
    cookieRegex: [
      /(^ad-id([0-9a-zA-Z_]+)?)+$/,
      /(^advertising_id([0-9a-zA-Z_]+)?)+$/,
      /(^fire_adid([0-9a-zA-Z_]+)?)+$/,
    ],
    domainRegex: createUrlRegex('amazon'),
  },
  [Advertisers.Apple]: {
    cookieRegex: [
      /(^idfa([0-9a-zA-Z_]+)?)+$/,
    ],
    domainRegex: createUrlRegex('apple'),
  },
  [Advertisers.Facebook]: {
    cookieRegex: [
      /(^c_user([0-9a-zA-Z_]+)?)+$/,
    ],
    domainRegex: createUrlRegex('facebook'),
  },
  [Advertisers.Google]: {
    cookieRegex: [
      /(^aaid([0-9a-zA-Z_]+)?)+$/,
      /(^aid([0-9a-zA-Z_]+)?)+$/,
      /(^gps([0-9a-zA-Z_]+)?)+$/,
    ],
    domainRegex: createUrlRegex('google'),
  },
  [Advertisers.Microsoft]: {
    cookieRegex: [
      /(^maid([0-9a-zA-Z_]+)?)+$/,
      /(^win_adid([0-9a-zA-Z_]+)?)+$/,
    ],
    domainRegex: createUrlRegex('microsoft'),
  },
  [Advertisers.Vk]: {
    cookieRegex: [
      /(^account_id([0-9a-zA-Z_]+)?)+$/,
    ],
    domainRegex: createUrlRegex('vk'),
  },
};

export const ADVERTISERS = Object.entries(ADVERTISERS_CONFIGURATION)
  .map(([advertiser, config]) => ({
    ...config,
    advertiser,
  }));
