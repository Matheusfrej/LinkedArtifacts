function openArtifactPage(paperId) {
  window.open(`${$constant.WEB_APP_URL}/papers/${paperId}`)
}

function createArtifactIcon(paperId) {
  const icon = document.createElement('span');
  icon.className = 'artifact-icon';
  icon.style.marginLeft = '8px';
  icon.style.width = '18px';
  icon.style.height = '18px';
  icon.style.flexShrink = '0';
  icon.title = 'Show Artifacts';
  icon.style.cursor = 'pointer';
  const iconUrl = chrome.runtime.getURL('icons/icon.svg');
  icon.style.background =
    `url("${iconUrl}") no-repeat center/contain`;
  icon.onclick = (e) => {
    e.stopPropagation();
    openArtifactPage(paperId);
  };

  return icon;
}

function createBadgeIcon(paperId, badge) {
  if (!badge || !badge.id || !badge.name) {
    return;
  }

  const icon = document.createElement('span');
  icon.className = `${badge.id}-badge-icon`;
  icon.style.marginLeft = '8px';
  icon.style.display = 'inline-block';
  icon.style.verticalAlign = 'middle';
  icon.style.width = '18px';
  icon.style.flexShrink = '0';
  icon.style.height = '18px';
  icon.title = `Artifact ${badge.name}`;
  icon.style.cursor = 'pointer';

  const domainToFileName = {
    'Available': 'available',
    'Evaluated & Functional': 'functional',
    'Evaluated & Reusable': 'reusable',
    'Results Reproduced': 'reproduced',
    'Results Replicated': 'replicated'
  }
  const fileName = domainToFileName[badge.name]

  if (!fileName) return;
  
  const iconUrl = chrome.runtime.getURL(`icons/artifact/${fileName}.svg`);
  icon.style.background = `url("${iconUrl}") no-repeat center/contain`;
  icon.onclick = (e) => {
    e.stopPropagation();
    openArtifactPage(paperId);
  };
  
  return icon;
}

function createIcons(paper) {
  const container = document.createElement('span');

  container.className = 'artifact-icons';
  container.style.display = 'inline-flex';
  container.style.alignItems = 'center';
  container.style.whiteSpace = 'nowrap';

  const hasArtifacts =
    (paper.artifacts && paper.artifacts.length > 0) || paper.hasArtifact;

  if (hasArtifacts) {
    const artifactIcon = createArtifactIcon(paper.id);
    if (artifactIcon) {
      container.appendChild(artifactIcon);
    }
  }

  const badges = paper.badges ?? [];
  for (const badge of badges) {
    const badgeIcon = createBadgeIcon(paper.id, badge);

    if (badgeIcon) {
      container.appendChild(badgeIcon);
    }
  }

  if (container.children.length === 0) {
    return null;
  }

  return container;
}

function normalizeTitle(title) {
  return title.trim().toLowerCase();
}

function searchTitlesInDOM(
  page,
  inProgress,
  checkedTitles,
  uniqueTitles,
  tasks
) {
  if (!['search', 'profile'].includes(page)) {
    throw new Error('Invalid page param: ' + page);
  }

  const ELEMENTS = {
    querySelectorAll: {
      search: '.gs_ri',
      profile: '.gsc_a_tr'
    },
    querySelector: {
      search: '.gs_rt',
      profile: '.gsc_a_at'
    }
  };

  const isSearch = page === 'search';

  const entries = document.querySelectorAll(
    ELEMENTS.querySelectorAll[page]
  );

  for (const entry of entries) {
    const titleElem = entry.querySelector(
      ELEMENTS.querySelector[page]
    );

    if (!titleElem) continue;

    const link = isSearch
      ? titleElem.querySelector('a')
      : titleElem;

    if (!link) continue;

    const paperTitle = link.textContent.trim();
    const normalizedTitle = normalizeTitle(paperTitle);

    const hasArtifactIcon = isSearch
      ? titleElem.querySelector('.artifact-icons') !== null
      : titleElem.nextSibling?.classList?.contains('artifact-icons');

    if (hasArtifactIcon) continue;
    if (inProgress.has(normalizedTitle)) continue;
    if (checkedTitles.has(normalizedTitle)) continue;
    if (uniqueTitles.has(normalizedTitle)) continue;

    uniqueTitles.add(normalizedTitle);
    inProgress.add(normalizedTitle);

    tasks.push({
      paperTitle,
      normalizedTitle,

      inject: (paper) => {
        const hasArtifactIcon = isSearch
          ? titleElem.querySelector('.artifact-icons') !== null
          : titleElem.nextSibling?.classList?.contains('artifact-icons');

        if (hasArtifactIcon) return;

        const icons = createIcons(paper);
        if (!icons) return;

        if (isSearch) {
          titleElem.appendChild(icons);
        } else {
          titleElem.parentNode.insertBefore(
            icons,
            titleElem.nextSibling
          );
        }
      }
    });
  }
}

async function addIconsToPaper() {
  const inProgress = $constant.artifactInProgress;
  const checkedTitles = $constant.artifactCheckedTitles;

  const tasks = [];
  const uniqueTitles = new Set();

  searchTitlesInDOM(
    'search',
    inProgress,
    checkedTitles,
    uniqueTitles,
    tasks
  );

  searchTitlesInDOM(
    'profile',
    inProgress,
    checkedTitles,
    uniqueTitles,
    tasks
  );

  console.log('Novos títulos:', uniqueTitles);

  if (tasks.length === 0) return;

  try {
    const titles = tasks.map(task => task.paperTitle);

    $logger.info(
      addIconsToPaper.name,
      'Fetching papers for titles:',
      titles
    );

    const papers = await $api.listPapersByTitles({ titles });

    for (const task of tasks) {
      checkedTitles.add(task.normalizedTitle);
      inProgress.delete(task.normalizedTitle);
    }

    const papersByTitle = new Map();

    for (const paper of papers) {
      papersByTitle.set(
        normalizeTitle(paper.title),
        paper
      );
    }

    for (const {
      normalizedTitle,
      inject
    } of tasks) {
      const paper = papersByTitle.get(normalizedTitle);

      const hasArtifacts =
        (paper?.artifacts && paper.artifacts.length > 0) || paper?.hasArtifact;
      const hasBadges = paper?.badges && paper.badges.length > 0;

      if (paper && (hasArtifacts || hasBadges)) {
        inject(paper);
      }
    }

  } catch (error) {
    $logger.error(
      addIconsToPaper.name,
      'Error fetching papers:',
      error
    );

    for (const task of tasks) {
      inProgress.delete(task.normalizedTitle);
    }
  }
}
