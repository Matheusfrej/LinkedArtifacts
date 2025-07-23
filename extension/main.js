(function main() {
  $logger.log(main.name, 'Started extension')
  addButtons();
  const observer = new MutationObserver(addButtons);
  observer.observe(document.body, { childList: true, subtree: true });
})();