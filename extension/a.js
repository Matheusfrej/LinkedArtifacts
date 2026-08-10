// search
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