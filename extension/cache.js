// Simple in-memory cache for artifact results by normalized title
const papersCache = {
  // normalizedTitle: {
  //   doi: '',
  //   artifacts: [
  //     {
  //       url: '',
  //       label: '',
  //       source: ''
  //     }
  // ]
  // },
  // doi: {
  //   normalizedTitle: '',
  //   artifacts: [
  //     {
  //       url: '',
  //       label: '',
  //       source: ''
  //     }
  // ]
  // }
};

const $cache = {
  // Get cache by normalizedTitle or DOI
  getPaper: (normalizedTitle, doi) => {
    if (doi) {
      // Try direct DOI lookup
      const cache = papersCache[doi];
      if (cache) {
        $logger.log('$cache.getPaper', { doi, cache });
        return cache;
      }
      return undefined;
    }
    // Lookup by normalizedTitle
    const cache = papersCache[normalizedTitle];
    if (cache) $logger.log('$cache.getPaper', { normalizedTitle, cache });
    return cache;
  },
  // Set cache by normalizedTitle and/or DOI
  setPaper: (normalizedTitle, doi, value) => {
    let norm = normalizedTitle;
    let d = doi;
    if (!norm && !d) throw Error("You should provide normalizedTitle or DOI to set paper by index.")
    // If only one key is provided, try to get the other from the existing cache
    if (!norm && d) {
      norm = $cache.getPaper(undefined, d)?.normalizedTitle;
      if (!norm) throw Error("Paper not found in cache.");
    }
    if (!d && norm) {
      d = $cache.getPaper(norm)?.doi;
    }
    // Compose new cache value
    let oldCache = {};
    let newCache = {};
    const index = norm ? norm : d;
    oldCache = { ...papersCache[index] };
    newCache = { ...papersCache[index], ...value };
    $logger.log('$cache.setPaper', { normalizedTitle: norm, doi: d, oldCache, newCache });
    papersCache[norm] = newCache;
    if (d) papersCache[d] = newCache;
  },
};

