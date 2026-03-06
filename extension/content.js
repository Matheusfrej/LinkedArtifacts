function openArtifactPage(paperId) {
  window.open(`http://localhost:3000/papers/${paperId}`)
}

function createArtifactIcon(paperId) {
  const icon = document.createElement('span');
  icon.className = 'artifact-icon';
  icon.style.marginLeft = '8px';
  icon.style.display = 'inline-block';
  icon.style.verticalAlign = 'middle';
  icon.style.width = '18px';
  icon.style.height = '18px';
  icon.title = 'Show Artifacts';
  icon.style.cursor = 'pointer';
  // blue circle
  const iconUrl = chrome.runtime.getURL('icons/icon.svg');
  icon.style.background = `url("${iconUrl}") no-repeat center/contain`;
  icon.onclick = (e) => {
    e.stopPropagation();
    openArtifactPage(paperId);
  };
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
    tasks.push({ paperTitle, inject: (paperId) => {
      if (![...titleElem.children].some(child => child.classList && child.classList.contains('artifact-icon'))) {
        const icon = createArtifactIcon(paperId);
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
    tasks.push({ paperTitle, inject: (paperId) => {
      if (!(titleLink.nextSibling && titleLink.nextSibling.classList && titleLink.nextSibling.classList.contains('artifact-icon'))) {
        const icon = createArtifactIcon(paperId);
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
        inject(paper.id);
        inProgress.delete(paperTitle);
      }
    }
  } catch (error) {
    $logger.error(addArtifactIcons.name, 'Error fetching papers:', error);
  }
}
