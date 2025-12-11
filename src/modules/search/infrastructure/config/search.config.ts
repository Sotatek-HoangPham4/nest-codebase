export const SearchConfig = () => ({
  searchEngine: process.env.SEARCH_ENGINE || 'elastic', // elastic | opensearch | meili

  elastic: {
    node: process.env.ELASTIC_NODE,
  },

  opensearch: {
    node: process.env.OPENSEARCH_NODE,
  },

  meili: {
    host: process.env.MEILI_HOST,
    apiKey: process.env.MEILI_API_KEY,
  },
});
