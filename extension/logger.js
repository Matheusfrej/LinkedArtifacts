const extensionName = 'LinkedArtifacts'

const $logger = {
  debug: (source, ...args) => {
    console.debug(`[${extensionName}][${source}]`, ...args);
  },
  info: (source, ...args) => {
    console.info(`[${extensionName}][${source}]`, ...args);
  },
  log: (source, ...args) => {
    console.log(`[${extensionName}][${source}]`, ...args);
  },
  warn: (source, ...args) => {
    console.warn(`[${extensionName}][${source}]`, ...args);
  },
  error: (source, ...args) => {
    console.error(`[${extensionName}][${source}]`, ...args);
  }
};
