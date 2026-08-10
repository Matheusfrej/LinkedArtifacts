(function main() {
  $logger.log(main.name, 'Started extension');
  // Debounce wrapper for addIconsToPaper
  let debounceTimer = null;
  function debounced() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      addIconsToPaper();
    }, 200); // 200ms debounce
  }
  addIconsToPaper();
  const observer = new MutationObserver(debounced);
  observer.observe(document.body, { childList: true, subtree: true });
})();