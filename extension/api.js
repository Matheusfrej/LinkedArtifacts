const $api = { 
  fetchDOI: async (parms = {
    title: ''
  }) => {
    // BSI Identify não é focado para pesquisa científica
    // ChinaDOI = ISTIC
    // KISTI não achei
    // const providers = ['Airiti', 'ISTIC', 'CNKI', 'Crossref', 'DataCite', 'EIDR', 'HAND', 'JaLC', 'mEDRA',  'OP']

    const title = parms.title

    const providerConfig = {
      crossref: {
        url: `https://api.crossref.org/works?query.title=${encodeURIComponent(title)}&rows=3`,
        extractItems: (json) =>
          json.message?.items?.map((item) => ({
            title: item.title?.[0] || '',
            doi: item.DOI,
            raw: item,
          })) || [],
      },
      // openalex: {
      //   url: `https://api.openalex.org/works?search=${encodeURIComponent(title)}&per-page=100`,
      //   extractItems: (json) =>
      //     json.results?.map((item) => ({
      //       title: item.title || '',
      //       doi: item.doi,
      //       raw: item,
      //     })) || [],
      // },
    }['crossref'];

    $logger.info('$api.fetchDOI', `query:`, providerConfig.url);

    const response = await fetch(providerConfig.url);
    const data = await response.json();
    $logger.info('$api.fetchDOI', `response:`, providerConfig.url);

    const items = providerConfig.extractItems(data);
    if (!items.length) return '';

    // Levenshtein distance for proximity
    function levenshtein(a, b) {
      if (a.length === 0) return b.length;
      if (b.length === 0) return a.length;
      const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
      for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
      for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          if (a[i - 1] === b[j - 1]) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + 1
            );
          }
        }
      }
      return matrix[a.length][b.length];
    }

    let best = null;
    let bestDistance = Infinity;

    for (const item of items) {
      const itemTitle = item.title.trim().toLowerCase();
      const distance = levenshtein(itemTitle, title);
      $logger.info('$api.fetchDOI', `candidate:`, item.title, 'distance:', distance);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = item;
      }
    }
    
    if (!best?.doi) return '';
    
    // 95% similarity threshold
    const maxLen = Math.max(title.length, best.title.trim().toLowerCase().length);
    const similarity = maxLen === 0 ? 1 : 1 - (bestDistance / maxLen);
    if (similarity < 0.95) return '';
    
    $logger.info('$api.fetchDOI', `best match:`, best.title, 'distance:', bestDistance, 'similarity:', similarity);
    $logger.info('$api.fetchDOI', `DOI found from ${'crossref'}:`, best.doi);
    
    return best.doi;
  }, 

  fetchArtifacts: async (parms = {
    doi: ''
  }) => {
    const result = [
      {
        url: 'https://www.google.com',
        label: 'Dataset'
      },
      {
        url: 'https://www.google.com',
        label: 'Code'
      },
    ]

    $logger.info('$api.fetchArtifacts', { parms, result })
    return result;
  }

}