interface SearchEngineConfig {
  urlRegex: RegExp;
  queryParam: string;
}

enum SearchEngine {
  Aol = 'aol.com',
  Archive = 'archive.com',
  Ask = 'ask.com',
  Baidu = 'baidu.com',
  Bing = 'bing.com',
  DuckDuckGo = 'duckduckgo.com',
  Ecosia = 'ecosia.org',
  Google = 'google.com',
  Yahoo = 'yahoo.com',
  Yandex = 'yandex.com',
}

const createUrlRegex = (engine: string): RegExp => new RegExp(`^(https?:\/\/)(www.)?(search.)?${engine}(\.[a-z]{2,})`);

const SEARCH_ENGINES_CONFIGURATION: Record<SearchEngine, SearchEngineConfig> = {
  [SearchEngine.Aol]: {
    urlRegex: createUrlRegex('aol'),
    queryParam: 'q',
  },
  [SearchEngine.Archive]: {
    urlRegex: createUrlRegex('archive'),
    queryParam: 'query',
  },
  [SearchEngine.Ask]: {
    urlRegex: createUrlRegex('ask'),
    queryParam: 'q',
  },
  [SearchEngine.Baidu]: {
    urlRegex: createUrlRegex('baidu'),
    queryParam: 'wd',
  },
  [SearchEngine.Bing]: {
    urlRegex: createUrlRegex('bing'),
    queryParam: 'q',
  },
  [SearchEngine.DuckDuckGo]: {
    urlRegex: createUrlRegex('duckduckgo'),
    queryParam: 'q',
  },
  [SearchEngine.Ecosia]: {
    urlRegex: createUrlRegex('ecosia'),
    queryParam: 'q',
  },
  [SearchEngine.Google]: {
    urlRegex: createUrlRegex('google'),
    queryParam: 'q',
  },
  [SearchEngine.Yahoo]: {
    urlRegex: createUrlRegex('yahoo'),
    queryParam: 'p',
  },
  [SearchEngine.Yandex]: {
    urlRegex: createUrlRegex('yandex'),
    queryParam: 'text',
  },
};

export const SEARCH_ENGINES = Object.entries(SEARCH_ENGINES_CONFIGURATION)
  .map(([engine, config]) => ({
    ...config,
    engine,
  }));
