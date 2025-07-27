function getWorkType(meta) {
  return meta?.work_type_id || meta?.['work_type_id'] || meta?.['work-type-id'] || '';
}

function getArtifactLabel(artifactMeta, repo) {
  let label = artifactMeta?.title;
  if (Array.isArray(label)) label = label[0];

  if (!label || typeof label !== 'string') {
    const type = getWorkType(artifactMeta);
    label = `${repo}${type ? ' ' + type : ''}`;
  }

  return label;
}

const $api = { 
  fetchDOI: async (parms = {
    title: '',
    year: 0
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
            year: item.published?.['date-parts']?.[0]?.[0],
            raw: item,
          })) || [],
      },
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

  fetchArtifacts: async (params = { doi: '' }) => {
    const { doi } = params;
    const results = [];
    const seenUrls = new Set();

    const repositoriesPatterns = {
      'Zenodo': ['10.5281', 'zenodo'],
      'Figshare': ['10.6084', 'figshare', 'm9.figshare'],
      'Dryad': ['10.5061', 'dryad'],
      'GitHub': ['github'],
      'Dataverse': ['10.7910', '/DVN/'],
      'OSF': ['10.17605', 'osf.io'],
      'Software Heritage': ['SWHID'],
      'Mendeley Data': ['10.17632'],
      'EUDAT B2Share': ['10.23728', 'B2SHARE']
    };

    // ------------------------------
    // 1. Busca no CrossRef Event Data
    // ------------------------------
    // Finds artifact from paper below
    // https://scholar.google.com.br/scholar?hl=pt-BR&as_sdt=0%2C5&q=corner.py%3A+Scatterplot+matrices+in+Python&btnG=

    // Finds artifact that is cited by paper below
    // https://scholar.google.com.br/scholar?hl=pt-BR&as_sdt=0%2C5&q=Open+collaborative+writing+with+Manubot&btnG=
    const eventTypes = ['obj-id', 'subj-id'];
    for (const direction of eventTypes) {
      let cursor = null;
      let totalResults = Infinity;
      let itemsSeen = 0;

      while (itemsSeen < totalResults) {
        try {
          let crEventUrl = `https://api.eventdata.crossref.org/v1/events?${direction}=doi:${encodeURIComponent(doi)}&rows=100`;
          if (cursor) crEventUrl += `&cursor=${encodeURIComponent(cursor)}`;

          $logger.info('$api.fetchArtifacts', `CrossRef Event Data query (${direction}):`, crEventUrl);
          const crEventRes = await fetch(crEventUrl);
          if (!crEventRes.ok) break;

          const crEventJson = await crEventRes.json();
          const events = crEventJson.message?.events || [];

          for (const ev of events) {
            const otherId = direction === 'obj-id' ? ev.subj_id : ev.obj_id;
            const artifactMeta = direction === 'obj-id' ? ev.subj : ev.obj;

            if (typeof otherId === 'string') {
              const isDOI = otherId.toLowerCase().startsWith('doi:');
              const doiStr = isDOI ? otherId.replace(/^doi:/i, '') : null;

              // Check if matches known repository pattern
              if (doiStr || otherId) {
                Object.entries(repositoriesPatterns).forEach(([repo, patterns]) => {
                  const idToCheck = doiStr || otherId;
                  if (patterns.some(pattern => idToCheck.includes(pattern))) {
                    const finalUrl = isDOI ? `https://doi.org/${doiStr}` : otherId;
                    const label = getArtifactLabel(artifactMeta, repo);

                    const existingIndex = results.findIndex(r => r.url === finalUrl);
                    // if stored label is smaller than current one, use new label, because it probably has more value
                    if (seenUrls.has(otherId) && existingIndex !== -1 && results[existingIndex].label.length < label?.length) {
                      results[existingIndex].label = label;
                    }
                    else if (!seenUrls.has(otherId)) {
                      results.push({
                        url: finalUrl,
                        label,
                        source: 'CrossRef',
                      });
                      seenUrls.add(otherId);
                    }
                  }
                });
              }
            }
          }

          cursor = crEventJson.message['next-cursor'];
          totalResults = crEventJson.message['total-results'];
          itemsSeen += crEventJson.message['items-per-page'];
        } catch (e) {
          $logger.error('$api.fetchArtifacts', `CrossRef Event Data error (${direction}):`, e);
          break;
        }
      }
    }


    // ------------------------------
    // 2. Busca por DOI na API do Zenodo
    // ------------------------------
    try {
      const zenodoUrl = `https://zenodo.org/api/records/?q=related_identifiers.identifier:"${encodeURIComponent(doi)}"`;
      $logger.info('$api.fetchArtifacts', 'Zenodo query:', zenodoUrl);

      const zenodoRes = await fetch(zenodoUrl);
      if (zenodoRes.ok) {
        const zenodoJson = await zenodoRes.json();
        for (const record of zenodoJson.hits?.hits || []) {
          const link = record.links?.html;
          if (link && !seenUrls.has(link)) {
            results.push({
              url: link,
              label: record.metadata?.title || 'Zenodo Record',
              source: 'Zenodo',
            });
            seenUrls.add(link);
          }
        }
      }
    } catch (e) {
      $logger.error('$api.fetchArtifacts', 'Zenodo API error:', e);
    }

    // // ------------------------------
    // // 3. Busca na API do OpenAlex
    // // ------------------------------
    // try {
    //   const openAlexUrl = `https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}`;
    //   $logger.info('$api.fetchArtifacts', 'OpenAlex query:', openAlexUrl);

    //   const openAlexRes = await fetch(openAlexUrl);
    //   if (openAlexRes.ok) {
    //     const work = await openAlexRes.json();

    //     // Verifica `primary_location` (às vezes aponta para datasets, etc.)
    //     const maybeUrl = work.primary_location?.source?.host_venue?.url;
    //     if (maybeUrl && !seenUrls.has(maybeUrl)) {
    //       results.push({
    //         url: maybeUrl,
    //         label: 'Primary Location',
    //         source: 'OpenAlex',
    //       });
    //       seenUrls.add(maybeUrl);
    //     }

    //     // Verifica `related_works`
    //     for (const related of work.related_works || []) {
    //       const relatedDoi = related.replace(/^https:\/\/doi\.org\//, '');
    //       const fullUrl = `https://doi.org/${relatedDoi}`;
    //       if (!seenUrls.has(fullUrl)) {
    //         results.push({
    //           url: fullUrl,
    //           label: 'Related Work',
    //           source: 'OpenAlex',
    //         });
    //         seenUrls.add(fullUrl);
    //       }
    //     }
    //   }
    // } catch (e) {
    //   $logger.error('$api.fetchArtifacts', 'OpenAlex API error:', e);
    // }

      // -------------------------------------------------
      // 4. Scraping do conteúdo do artigo
      // -------------------------------------------------

      return results;
  }

}