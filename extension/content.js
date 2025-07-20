// content.js
// Main entry point for the extension
// Use the global addArtifactButtons from artifactButton.js
// artifactButton.js
// Handles adding the artifact button to Google Scholar entries
// All dependencies are now included directly for content script compatibility

// --- UI Styles ---
function getArtifactBtnStyles() {
  return {
    marginLeft: '8px',
    background: '#4285f4', // Google blue
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(60,64,67,.3)',
    transition: 'background 0.2s',
  };
}

function styleArtifactBtn(btn) {
  const styles = getArtifactBtnStyles();
  Object.assign(btn.style, styles);
  btn.onmouseover = () => btn.style.background = '#3367d6';
  btn.onmouseout = () => btn.style.background = '#4285f4';
}

// --- Modal Components ---
function createArtifactCloseBtn(action) {
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
  closeBtn.onclick = () => action();
  return closeBtn;
}

async function fetchArtifacts({ title, authors, year }) {
  // Step 1: Try to get DOI from CrossRef
  let doi = '';
  console.log('[Artifacts] Searching for DOI using title:', title);

  const providers = ['crossref', 'openalex']

  let i = 0
  while (i < providers.length && !doi) {
    doi = await fetchDOIFromProvider(providers[i], title, authors, year)
    i++
  }

  const results = [];
  if (!doi) {
    results.push({
      label: 'No DOI found for this paper.',
    });
    console.log('[Artifacts] No DOI found for title:', title);
    return results;
  }

  // Step 2: Use DOI to get artifacts from CrossRef Event Data
  results.push(...await fetchArtifactsFromCrossRefEventData(doi));

  if (results.length === 0) {
    results.push({
      label: `No artifact found for paper with DOI ${doi}`,
    });
    console.log('[Artifacts] No artifacts found, showing DOI:', doi);
  }
  
  console.log('[Artifacts] Final results:', results);
  return results;

}

async function fetchDOIFromProvider(provider, title, authors, year) {
  try {
    const normalizedTitle = title.trim().toLowerCase();

    const providerConfig = {
      crossref: {
        url: `https://api.crossref.org/works?query.title=${encodeURIComponent(title)}&rows=20`,
        extractItems: (json) =>
          json.message?.items?.map((item) => ({
            title: item.title?.[0] || '',
            doi: item.DOI,
            year: item.published?.['date-parts']?.[0]?.[0],
            authors: item.author?.map((a) => a.family),
            raw: item,
          })) || [],
      },
      openalex: {
        url: `https://api.openalex.org/works?search=${encodeURIComponent(title)}&per-page=100`,
        extractItems: (json) =>
          json.results?.map((item) => ({
            title: item.title || '',
            doi: item.doi,
            year: item.publication_year,
            authors: item.authorships?.map((a) => a.author.display_name),
            raw: item,
          })) || [],
      },
    }[provider];

    if (!providerConfig) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    console.log(`[Artifacts] ${provider} query:`, providerConfig.url);

    const response = await fetch(providerConfig.url);
    const data = await response.json();
    console.log(`[Artifacts] ${provider} response:`, data);

    const items = providerConfig.extractItems(data);
    if (!items.length) return '';

    let best = null;
    let bestScore = 40;

    for (const item of items) {
      let score = 0;
      const itemTitle = item.title.trim().toLowerCase();

      if (itemTitle === normalizedTitle) score += 100;
      else if (itemTitle.includes(normalizedTitle)) score += 50;
      else if (normalizedTitle.includes(itemTitle)) score += 30;

      if (year && item.year && String(item.year) === String(year)) score += 20;

      if (authors && item.authors?.length) {
        const authorStr = item.authors.join(', ').toLowerCase();
        if (authors.toLowerCase().includes(authorStr)) score += 10;
      }

      console.log(`[Artifacts] ${provider} candidate:`, item.title, 'score:', score);
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }

    if (best) {
      console.log(`[Artifacts] ${provider} best match:`, best.title, 'score:', bestScore);
      if (best.doi) {
        console.log(`[Artifacts] DOI found from ${provider}:`, best.doi);
        return best.doi;
      }
    }
  } catch (e) {
    console.error(`[Artifacts] ${provider} error:`, e);
  }

  return '';
}



async function fetchArtifactsFromCrossRefEventData(doi) {
  const results = [];
  const seenUrls = new Set();

  const knownArtifactSources = [
    'zenodo.org',
    'figshare.com',
    'dryad',
    'github.com',
    'dataverse',
    'osf.io',
    'softwareheritage.org',
  ];
  const knownDOIPrefixes = [
    '10.5281',   // Zenodo
    '10.6084',   // Figshare
    '10.5061',   // Dryad
    '10.7910',   // Dataverse
    '10.17605',  // OSF
    '10.31219',  // OSF (alt)
    '10.25795',  // Software Heritage
  ];

  // We'll search both directions: DOI as object (referenced) and subject (citing)
  const eventTypes = ['obj-id', 'subj-id'];

  for (const direction of eventTypes) {
  let cursor = null; // start with no cursor
  let first = true;

  while (cursor || (!cursor && first)) {
    try {
      first = false;
      let crEventUrl = `https://api.eventdata.crossref.org/v1/events?${direction}=doi:${encodeURIComponent(doi)}&source=datacite&rows=100`;
      if (cursor) {
        crEventUrl += `&cursor=${encodeURIComponent(cursor)}`;
      }

      console.log(`[Artifacts] CrossRef Event Data query (${direction}):`, crEventUrl);

      const crEventRes = await fetch(crEventUrl);
      if (!crEventRes.ok) {
        console.error(`[Artifacts] CrossRef Event Data fetch failed (${direction}):`, crEventRes.status, crEventRes.statusText);
        break; // stop paging on error
      }
      const crEventJson = await crEventRes.json();
      console.log(`[Artifacts] CrossRef Event Data response (${direction}):`, crEventJson);

      if (crEventJson.message && Array.isArray(crEventJson.message.events)) {
        crEventJson.message.events.forEach(ev => {
          const url = direction === 'obj-id' ? ev.obj_id : ev.subj_id;

          // Only accept if it's a DOI with known prefix or a known repo URL
          if (typeof url === 'string') {
            const isDOI = url.toLowerCase().startsWith('doi:');
            const doiStr = isDOI ? url.replace(/^doi:/i, '') : null;

            const matchesDOIPrefix = doiStr && knownDOIPrefixes.some(prefix => doiStr.startsWith(prefix));
            const matchesRepoURL = knownArtifactSources.some(domain => url.includes(domain));

            if ((matchesDOIPrefix || matchesRepoURL) && !seenUrls.has(url)) {
              results.push({
                url: isDOI ? `https://doi.org/${doiStr}` : url,
                label: ev.source_id || 'CrossRef Artifact',
                source: 'CrossRef',
              });
              seenUrls.add(url);
              console.log('[Artifacts] CrossRef Artifact:', url);
            }
          }
        });
      }

      cursor = crEventJson.message['next-cursor'];
      console.log("!cursor && first: ", !cursor && first);
      console.log("cursor: ", cursor);
      

    } catch (e) {
      console.error(`[Artifacts] CrossRef Event Data error (${direction}):`, e);
      break; // stop paging on error
    }
  }
}


  return results;
}



function createArtifactList(artifacts) {
  const list = document.createElement('ul');
  list.style.paddingLeft = '20px';
  if (!artifacts || artifacts.length === 0) {
    list.innerHTML = '<li>No artifacts found.</li>';
    return list;
  }
  artifacts.forEach(a => {
    const li = document.createElement('li');
    if (a.url) {
      const link = document.createElement('a');
      link.href = a.url;
      link.textContent = `${a.label}`;
      link.target = '_blank';
      li.appendChild(link);
    } else {
      li.textContent = `${a.label}`;
    }
    list.appendChild(li);
  });
  return list;
}

function createArtifactModalContent(paperTitle, closeBtn, artifacts) {
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

  const list = createArtifactList(artifacts);

  content.appendChild(closeBtn);
  content.appendChild(title);
  content.appendChild(paperTitleElem);
  content.appendChild(list);
  return content;
}

async function createArtifactModal(paperTitle, authors = '', year = '') {
  if (document.getElementById('artifact-modal')) return;
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

  const closeBtn = createArtifactCloseBtn(() => modal.remove());
  // Loading spinner
  const loading = document.createElement('div');
  loading.textContent = 'Searching for artifacts...';
  loading.style.padding = '32px';
  loading.style.textAlign = 'center';
  loading.style.background = '#fff';
  loading.style.borderRadius = '8px';
  modal.appendChild(loading);
  document.body.appendChild(modal);

  setTimeout(() => modal.focus(), 0);
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

  //console.log(encodeURIComponent(paperTitle));
  
  console.log('[Artifacts] Modal opened for:', paperTitle, authors, year);
  // Fetch artifacts
  let artifacts = [];
  try {
    artifacts = await fetchArtifacts({ title: paperTitle, authors, year });
  } catch (e) { console.error('[Artifacts] Error fetching artifacts:', e); }

  modal.removeChild(loading);
  const content = createArtifactModalContent(paperTitle, closeBtn, artifacts);
  modal.appendChild(content);
  setTimeout(() => content.focus(), 0);
}

function createArtifactBtn(titleElem, paperTitle) {
  const btn = document.createElement('button');
  btn.textContent = 'Show Artifacts';
  btn.className = 'artifact-btn';
  styleArtifactBtn(btn);
  btn.onclick = (e) => {
    e.stopPropagation();
    // Try to extract authors and year if available
    let authors = '';
    let year = '';
    const entry = titleElem.closest('.gs_ri');
    if (entry) {
      const authorElem = entry.querySelector('.gs_a');
      if (authorElem) {
        const authorText = authorElem.textContent;
        // Example: "A Author, B Author - Journal, 2022 - ..."
        const yearMatch = authorText.match(/\b(19|20)\d{2}\b/);
        year = yearMatch ? yearMatch[0] : '';
        authors = authorText.split('-')[0].trim();
        console.log('[Artifacts] Extracted authors:', authors, 'year:', year);
      }
    }
    createArtifactModal(paperTitle, authors, year);
  };
  titleElem.appendChild(btn);
}

function addArtifactButtons() {
  const entries = document.querySelectorAll('.gs_ri');
  entries.forEach(entry => {
    if (entry.querySelector('.artifact-btn')) return;
    const title = entry.querySelector('.gs_rt');
    if (!title || !title.querySelector('a')) return;
    const link = title.querySelector('a');
    let paperTitle = link ? link.textContent.trim().toLowerCase() : title.textContent.trim().toLowerCase();
    createArtifactBtn(title, paperTitle);
  });
}

function main() {
  addArtifactButtons();
  const observer = new MutationObserver(addArtifactButtons);
  observer.observe(document.body, { childList: true, subtree: true });
}

main();