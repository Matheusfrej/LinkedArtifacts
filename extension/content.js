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

function openArtifactPage(paperId) {
  window.open(`http://localhost:3000/papers/${paperId}`)
}

// Return a random state for demo/testing purposes
function getRandomState() {
  const states = ['success', 'processing', 'error', 'no_artifact']
  return states[Math.floor(Math.random() * states.length)]
}

function createArtifactIcon(paperId, artifacts, state) {
  const icon = document.createElement('span');
  icon.className = 'artifact-icon';
  icon.style.marginLeft = '8px';
  icon.style.display = 'inline-block';
  icon.style.verticalAlign = 'middle';
  icon.style.width = '18px';
  icon.style.height = '18px';
  switch (state) {
    case 'success':
      icon.title = 'Show Artifacts';
      // blue circle
      icon.style.background = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%234285f4\'><circle cx=\'12\' cy=\'12\' r=\'10\' fill=\'%234285f4\'/><text x=\'12\' y=\'16\' text-anchor=\'middle\' font-size=\'12\' fill=\'white\'>A</text></svg>") no-repeat center/contain';
      icon.style.cursor = 'pointer';
      icon.onclick = (e) => {
        e.stopPropagation();
        openArtifactPage(paperId);
      };
      break;
    case 'processing':
      icon.title = 'Processing Paper...';
      // yellow circle
      icon.style.background = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'><circle cx=\'12\' cy=\'12\' r=\'10\' fill=\'%23f59e0b\'/><text x=\'12\' y=\'16\' text-anchor=\'middle\' font-size=\'12\' fill=\'white\'>A</text></svg>") no-repeat center/contain';
      break;
    case 'error':
      icon.title = 'Error Extracting Artifacts';
      // red circle with exclamation
      icon.style.background = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'><circle cx=\'12\' cy=\'12\' r=\'10\' fill=\'%23ef4444\'/><text x=\'12\' y=\'16\' text-anchor=\'middle\' font-size=\'12\' fill=\'white\'>!</text></svg>") no-repeat center/contain';
      break;
    case 'no_artifact':
      icon.title = 'No Artifacts';
      // show a large red X centered
      icon.style.background = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'><circle cx=\'12\' cy=\'12\' r=\'10\' fill=\'%234285f4\'/><text x=\'12\' y=\'16\' text-anchor=\'middle\' font-size=\'12\' font-weight=\'bold\' fill=\'%23ef4444\'>✖</text></svg>") no-repeat center/contain';
      break;
    default:
      throw new Error('undefined paper state.')
  }
  return icon;
}

async function addArtifactIcons() {
  const inProgress = $constant.artifactInProgress;
  // Collect all papers to process (main results and researcher profile)
  const tasks = [];
  const uniqueTitles = new Set();

  // Main search results
  const entries = document.querySelectorAll('.gs_ri');
  for (const entry of entries) {
    const titleElem = entry.querySelector('.gs_rt');
    if (!titleElem || !titleElem.querySelector('a')) continue;
    const link = titleElem.querySelector('a');
    const paperTitle = link.textContent.trim();
    if ([...titleElem.children].some(child => child.classList && child.classList.contains('artifact-icon'))) continue;
    if (inProgress.has(paperTitle)) continue;
    uniqueTitles.add(paperTitle);
    tasks.push({ paperTitle, inject: (artifacts, paperId) => {
      if (![...titleElem.children].some(child => child.classList && child.classList.contains('artifact-icon'))) {
        const icon = createArtifactIcon(paperId, artifacts, 'success');
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
    uniqueTitles.add(paperTitle);
    tasks.push({ paperTitle, inject: (artifacts, paperId) => {
      if (!(titleLink.nextSibling && titleLink.nextSibling.classList && titleLink.nextSibling.classList.contains('artifact-icon'))) {
        const icon = createArtifactIcon(paperId, artifacts, 'success');
        if (icon) titleLink.parentNode.insertBefore(icon, titleLink.nextSibling);
      }
    }});
  }

  if (tasks.length === 0) return;

  // Call API to fetch papers with artifacts
  try {
    const titles = Array.from(uniqueTitles);
    $logger.info(addArtifactIcons.name, 'Fetching papers for titles:', titles);
    
    const papers = await $api.listPapersByTitles({ titles })
    // console.log(papers);
    
    // Create a map of titles to papers for quick lookup
    const papersByTitle = new Map();
    for (const paper of papers) {
      papersByTitle.set(paper.title.toLowerCase().trim(), paper);
    }

    // Inject icons for papers with artifacts
    for (const { paperTitle, inject } of tasks) {
      const paper = papersByTitle.get(paperTitle.toLowerCase().trim());
      if (paper && paper.artifacts && paper.artifacts.length > 0) {
        inProgress.add(paperTitle);
        inject(paper.artifacts, paper.id);
        inProgress.delete(paperTitle);
      }
    }
  } catch (error) {
    $logger.error(addArtifactIcons.name, 'Error fetching papers:', error);
  }
}
