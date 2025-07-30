(function main() {
  $logger.log(main.name, 'Started extension');
  // Debounce wrapper for addArtifactIcons
  let debounceTimer = null;
  function debouncedAddArtifactIcons() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      addArtifactIcons();
    }, 200); // 200ms debounce
  }
  addArtifactIcons();
  const observer = new MutationObserver(debouncedAddArtifactIcons);
  observer.observe(document.body, { childList: true, subtree: true });
})();