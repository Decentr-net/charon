interface SearchEngineConfig {
  urlRegex: RegExp;
  queryParam: string;
}

enum SearchEngine {
  Aol = 'aol',
  Archive = 'archive',
  Ask = 'ask',
  Baidu = 'baidu',
  Bing = 'bing',
  DuckDuckGo = 'duckduckgo',
  Ecosia = 'ecosia',
  Google = 'google',
  Yahoo = 'yahoo',
  Yandex = 'yandex',
}

const createUrlRegex = (engine: string): RegExp => new RegExp(`^(https?:\/\/)(www.)?(search.)?${engine}(\.[a-z]{2,})`);

const SEARCH_ENGINES_CONFIGURATION: Record<SearchEngine, SearchEngineConfig> = {
  [SearchEngine.Aol]: {
    urlRegex: createUrlRegex(SearchEngine.Aol),
    queryParam: 'q',
  },
  [SearchEngine.Archive]: {
    urlRegex: createUrlRegex(SearchEngine.Archive),
    queryParam: 'query',
  },
  [SearchEngine.Ask]: {
    urlRegex: createUrlRegex(SearchEngine.Ask),
    queryParam: 'q',
  },
  [SearchEngine.Baidu]: {
    urlRegex: createUrlRegex(SearchEngine.Baidu),
    queryParam: 'wd',
  },
  [SearchEngine.Bing]: {
    urlRegex: createUrlRegex(SearchEngine.Bing),
    queryParam: 'q',
  },
  [SearchEngine.DuckDuckGo]: {
    urlRegex: createUrlRegex(SearchEngine.DuckDuckGo),
    queryParam: 'q',
  },
  [SearchEngine.Ecosia]: {
    urlRegex: createUrlRegex(SearchEngine.Ecosia),
    queryParam: 'q',
  },
  [SearchEngine.Google]: {
    urlRegex: createUrlRegex(SearchEngine.Google),
    queryParam: 'q',
  },
  [SearchEngine.Yahoo]: {
    urlRegex: createUrlRegex(SearchEngine.Yahoo),
    queryParam: 'p',
  },
  [SearchEngine.Yandex]: {
    urlRegex: createUrlRegex(SearchEngine.Yandex),
    queryParam: 'text',
  },
};

export const SEARCH_ENGINES = Object.entries(SEARCH_ENGINES_CONFIGURATION)
  .map(([engine, config]) => ({
    ...config,
    engine,
  }));
