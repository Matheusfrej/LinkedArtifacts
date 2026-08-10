// profile
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