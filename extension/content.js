async function fetchArtifacts(title) {
  // Step 1: fetch DOI
  const artifacts = [];
  let errorMsg = '';
  let doi = '';
  const normalizedTitle = title.trim().toLowerCase();

  if (!normalizedTitle) {
    return [[], 'Error while fetching paper title'];
  }

  $logger.info(fetchArtifacts.name, 'Searching for DOI using title: ', normalizedTitle)
  try {
    doi = await $api.fetchDOI({ title: normalizedTitle })
    if (!doi) {
      errorMsg = 'No DOI found for paper.';
      $logger.info(fetchArtifacts.name, errorMsg)
      return [[], errorMsg];
    }
  } catch (error) {
    errorMsg = 'Error retrieving DOI for paper';
    $logger.error(fetchArtifacts.name, errorMsg, error)
    return [[], errorMsg];
  }
  

  // Step 2: Use DOI to get artifacts
  try {
    artifacts.push(...await $api.fetchArtifacts({ doi }));

    if (artifacts.length === 0) {
      errorMsg = `No artifact found for paper with DOI ${doi}`;
      $logger.info(fetchArtifacts.name, errorMsg)
      return [[], errorMsg];
    }
  } catch (error) {
    errorMsg = `Error while retrieving artifacts from paper with DOI ${doi}`;
    $logger.error(fetchArtifacts.name, errorMsg, error)
    return [[], errorMsg];
  }
  
  $logger.info(fetchArtifacts.name, 'Final results: ', artifacts)
  return [artifacts, errorMsg];
}

// async function fetchDOI(title) {
  // try {
  //   // BSI Identify não é focado para pesquisa científica
  //   // ChinaDOI = ISTIC
  //   // KISTI não achei
  //   const providers = ['Airiti', 'ISTIC', 'CNKI', 'Crossref', 'DataCite', 'EIDR', 'HAND', 'JaLC', 'mEDRA',  'OP']

  //   const providerConfig = {
  //     crossref: {
  //       url: `https://api.crossref.org/works?query.title=${encodeURIComponent(title)}&rows=20`,
  //       extractItems: (json) =>
  //         json.message?.items?.map((item) => ({
  //           title: item.title?.[0] || '',
  //           doi: item.DOI,
  //           year: item.published?.['date-parts']?.[0]?.[0],
  //           authors: item.author?.map((a) => a.family),
  //           raw: item,
  //         })) || [],
  //     },
  //     openalex: {
  //       url: `https://api.openalex.org/works?search=${encodeURIComponent(title)}&per-page=100`,
  //       extractItems: (json) =>
  //         json.results?.map((item) => ({
  //           title: item.title || '',
  //           doi: item.doi,
  //           year: item.publication_year,
  //           authors: item.authorships?.map((a) => a.author.display_name),
  //           raw: item,
  //         })) || [],
  //     },
  //   }[provider];

  //   if (!providerConfig) {
  //     throw new Error(`Unsupported provider: ${provider}`);
  //   }

  //   console.log(`[Artifacts] ${provider} query:`, providerConfig.url);

  //   const response = await fetch(providerConfig.url);
  //   const data = await response.json();
  //   console.log(`[Artifacts] ${provider} response:`, data);

  //   const items = providerConfig.extractItems(data);
  //   if (!items.length) return '';

  //   let best = null;
  //   let bestScore = 40;

  //   for (const item of items) {
  //     let score = 0;
  //     const itemTitle = item.title.trim().toLowerCase();

  //     if (itemTitle === normalizedTitle) score += 100;
  //     else if (itemTitle.includes(normalizedTitle)) score += 50;
  //     else if (normalizedTitle.includes(itemTitle)) score += 30;

  //     if (year && item.year && String(item.year) === String(year)) score += 20;

  //     if (authors && item.authors?.length) {
  //       const authorStr = item.authors.join(', ').toLowerCase();
  //       if (authors.toLowerCase().includes(authorStr)) score += 10;
  //     }

  //     console.log(`[Artifacts] ${provider} candidate:`, item.title, 'score:', score);
  //     if (score > bestScore) {
  //       bestScore = score;
  //       best = item;
  //     }
  //   }

  //   if (best) {
  //     console.log(`[Artifacts] ${provider} best match:`, best.title, 'score:', bestScore);
  //     if (best.doi) {
  //       console.log(`[Artifacts] DOI found from ${provider}:`, best.doi);
  //       return best.doi;
  //     }
  //   }
  // } catch (e) {
  //   console.error(`[Artifacts] ${provider} error:`, e);
  // }

//   return '';
// }

// async function fetchArtifactsFromCrossRefEventData(doi) {
//   const results = [];
//   const seenUrls = new Set();

//   const knownArtifactSources = [
//     'zenodo.org',
//     'figshare.com',
//     'dryad',
//     'github.com',
//     'dataverse',
//     'osf.io',
//     'softwareheritage.org',
//   ];
//   const knownDOIPrefixes = [
//     '10.5281',   // Zenodo
//     '10.6084',   // Figshare
//     '10.5061',   // Dryad
//     '10.7910',   // Dataverse
//     '10.17605',  // OSF
//     '10.31219',  // OSF (alt)
//     '10.25795',  // Software Heritage
//   ];

//   // We'll search both directions: DOI as object (referenced) and subject (citing)
//   const eventTypes = ['obj-id', 'subj-id'];

//   for (const direction of eventTypes) {
//   let cursor = null; // start with no cursor
//   let first = true;

//   while (cursor || (!cursor && first)) {
//     try {
//       first = false;
//       let crEventUrl = `https://api.eventdata.crossref.org/v1/events?${direction}=doi:${encodeURIComponent(doi)}&source=datacite&rows=100`;
//       if (cursor) {
//         crEventUrl += `&cursor=${encodeURIComponent(cursor)}`;
//       }

//       console.log(`[Artifacts] CrossRef Event Data query (${direction}):`, crEventUrl);

//       const crEventRes = await fetch(crEventUrl);
//       if (!crEventRes.ok) {
//         console.error(`[Artifacts] CrossRef Event Data fetch failed (${direction}):`, crEventRes.status, crEventRes.statusText);
//         break; // stop paging on error
//       }
//       const crEventJson = await crEventRes.json();
//       console.log(`[Artifacts] CrossRef Event Data response (${direction}):`, crEventJson);

//       if (crEventJson.message && Array.isArray(crEventJson.message.events)) {
//         crEventJson.message.events.forEach(ev => {
//           const url = direction === 'obj-id' ? ev.obj_id : ev.subj_id;

//           // Only accept if it's a DOI with known prefix or a known repo URL
//           if (typeof url === 'string') {
//             const isDOI = url.toLowerCase().startsWith('doi:');
//             const doiStr = isDOI ? url.replace(/^doi:/i, '') : null;

//             const matchesDOIPrefix = doiStr && knownDOIPrefixes.some(prefix => doiStr.startsWith(prefix));
//             const matchesRepoURL = knownArtifactSources.some(domain => url.includes(domain));

//             if ((matchesDOIPrefix || matchesRepoURL) && !seenUrls.has(url)) {
//               results.push({
//                 url: isDOI ? `https://doi.org/${doiStr}` : url,
//                 label: ev.source_id || 'CrossRef Artifact',
//                 source: 'CrossRef',
//               });
//               seenUrls.add(url);
//               console.log('[Artifacts] CrossRef Artifact:', url);
//             }
//           }
//         });
//       }

//       cursor = crEventJson.message['next-cursor'];
//       console.log("!cursor && first: ", !cursor && first);
//       console.log("cursor: ", cursor);
      

//     } catch (e) {
//       console.error(`[Artifacts] CrossRef Event Data error (${direction}):`, e);
//       break; // stop paging on error
//     }
//   }
// }


//   return results;
// }

function createArtifactList(artifacts, errorMsg) {
  const list = document.createElement('ul');
  list.style.paddingLeft = '20px';
  if (errorMsg) {
    list.innerHTML = `<li>${errorMsg}</li>`;
    return list;
  }
  artifacts.forEach(a => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.url;
    link.textContent = `${a.label}`;
    link.target = '_blank';
    li.appendChild(link);

    list.appendChild(li);
  });
  return list;
}

function createArtifactModalContent(paperTitle, closeBtn, list) {
  const content = document.createElement('div');
  Object.assign(content.style, {
    background: '#fff',
    borderRadius: '8px',
    padding: '24px 32px',
    minWidth: '320px',
    boxShadow: '0 2px 16px rgba(60,64,67,.3)',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
    textAlign: 'left',
    outline: 'none',
  });
  content.tabIndex = 0;

  const title = document.createElement('h2');
  title.id = 'artifact-modal-title';
  title.textContent = 'Artifacts';
  title.style.marginTop = '0';
  title.style.color = '#4285f4';

  const paperTitleElem = document.createElement('div');
  paperTitleElem.textContent = paperTitle || '';
  paperTitleElem.style.fontWeight = 'bold';
  paperTitleElem.style.margin = '8px 0 16px 0';
  paperTitleElem.style.fontSize = '1.05em';
  paperTitleElem.style.color = '#222';

  content.appendChild(closeBtn);
  content.appendChild(title);
  content.appendChild(paperTitleElem);
  content.appendChild(list);
  return content;
}

async function createArtifactModal(paperTitle) {
  if (document.getElementById('artifact-modal')) { 
    $logger.info(createArtifactModal.name, 'Modal already open.'); 
    return;
  }

  // modal structure
  const modal = document.createElement('div');
  modal.id = 'artifact-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'artifact-modal-title');
  modal.tabIndex = -1;
  Object.assign(modal.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999',
  });

  // Modal close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Close modal');
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '8px',
    right: '12px',
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    color: '#888',
    cursor: 'pointer',
  });
  closeBtn.onclick = () => modal.remove();

  // Loading spinner
  const loading = document.createElement('div');
  loading.textContent = 'Searching for artifacts...';
  loading.style.padding = '32px';
  loading.style.textAlign = 'center';
  loading.style.background = '#fff';
  loading.style.borderRadius = '8px';
  modal.appendChild(loading);
  document.body.appendChild(modal);

  
  // modal event listener
  modal.addEventListener('keydown', function handleKeyDown(e) {
    if (e.key === 'Escape') modal.remove();
    if (e.key === 'Tab') {
      const focusable = [closeBtn];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  
  $logger.info(createArtifactModal.name, 'Modal opened for: ', paperTitle) 
  // Fetch artifacts
  const [artifacts, errorMsg] = await fetchArtifacts(paperTitle);

  const list = createArtifactList(artifacts, errorMsg);
  const content = createArtifactModalContent(paperTitle, closeBtn, list);
  
  // change loading for real content
  modal.removeChild(loading);
  modal.appendChild(content);

  // defers the focus call until after the browser has had a chance to render the new content
  setTimeout(() => content.focus(), 0);
}


function createArtifactIcon(paperTitle, artifacts) {
  // Only show icon if artifacts are present
  if (!artifacts || artifacts.length === 0) return null;
  const icon = document.createElement('span');
  icon.className = 'artifact-icon';
  icon.title = 'Show Artifacts';
  icon.style.marginLeft = '8px';
  icon.style.cursor = 'pointer';
  icon.style.display = 'inline-block';
  icon.style.verticalAlign = 'middle';
  icon.style.width = '18px';
  icon.style.height = '18px';
  icon.style.background = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%234285f4\'><circle cx=\'12\' cy=\'12\' r=\'10\' fill=\'%234285f4\'/><text x=\'12\' y=\'16\' text-anchor=\'middle\' font-size=\'12\' fill=\'white\'>A</text></svg>") no-repeat center/contain';
  icon.onclick = (e) => {
    e.stopPropagation();
    createArtifactModal(paperTitle);
  };
  return icon;
}

async function addArtifactIcons() {
  // Throttle requests: process one paper at a time with delay
  const DELAY_MS = 1000; // 1 second between requests
  const inProgress = $constant.artifactInProgress;
  // Collect all papers to process (main results and researcher profile)
  const tasks = [];

  // Main search results
  const entries = document.querySelectorAll('.gs_ri');
  for (const entry of entries) {
    const titleElem = entry.querySelector('.gs_rt');
    if (!titleElem || !titleElem.querySelector('a')) continue;
    const link = titleElem.querySelector('a');
    const paperTitle = link.textContent.trim();
    if ([...titleElem.children].some(child => child.classList && child.classList.contains('artifact-icon'))) continue;
    if (inProgress.has(paperTitle)) continue;
    tasks.push({ paperTitle, inject: (artifacts) => {
      if (![...titleElem.children].some(child => child.classList && child.classList.contains('artifact-icon'))) {
        const icon = createArtifactIcon(paperTitle, artifacts);
        if (icon) titleElem.appendChild(icon);
      }
    }});
  }

  // Researcher profile page: table rows
  const tableRows = document.querySelectorAll('.gsc_a_tr');
  for (const row of tableRows) {
    const titleLink = row.querySelector('.gsc_a_at');
    if (!titleLink) continue;
    const paperTitle = titleLink.textContent.trim();
    if (titleLink.nextSibling && titleLink.nextSibling.classList && titleLink.nextSibling.classList.contains('artifact-icon')) continue;
    if (inProgress.has(paperTitle)) continue;
    tasks.push({ paperTitle, inject: (artifacts) => {
      if (!(titleLink.nextSibling && titleLink.nextSibling.classList && titleLink.nextSibling.classList.contains('artifact-icon'))) {
        const icon = createArtifactIcon(paperTitle, artifacts);
        if (icon) titleLink.parentNode.insertBefore(icon, titleLink.nextSibling);
      }
    }});
  }

  // Process tasks sequentially with delay to avoid API rate limits
  async function processQueue(idx) {
    if (idx >= tasks.length) return;
    const { paperTitle, inject } = tasks[idx];
    inProgress.add(paperTitle);
    try {
      const [artifacts, errorMsg] = await fetchArtifacts(paperTitle);
      if (errorMsg) {
        $logger.warn(errorMsg);
      } else if (artifacts?.length > 0) {
        inject(artifacts);
      }
    } finally {
      inProgress.delete(paperTitle);
      setTimeout(() => processQueue(idx + 1), DELAY_MS);
    }
  }
  if (tasks.length > 0) processQueue(0);
}
