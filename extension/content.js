// content.js
// Main entry point for the extension
// Use the global addArtifactButtons from artifactButton.js
// artifactButton.js
// Handles adding the artifact button to Google Scholar entries
// All dependencies are now included directly for content script compatibility

const getArtifactBtnStyles = () => {
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

const styleArtifactBtn = (btn) => {
  const styles = getArtifactBtnStyles();
  Object.assign(btn.style, styles);
  btn.onmouseover = () => btn.style.background = '#3367d6';
  btn.onmouseout = () => btn.style.background = '#4285f4';
}

const createArtifactCloseBtn = (action) => {
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

const createArtifactList = () => {
  const list = document.createElement('ul');
  list.style.paddingLeft = '20px';
  list.innerHTML = `
    <li><a href='#' target='_blank'>Code Repository (GitHub)</a></li>
    <li><a href='#' target='_blank'>Dataset (Zenodo)</a></li>
    <li><a href='#' target='_blank'>Project Website</a></li>
  `;
  return list;
}

const createArtifactModal = (paperTitle) => {
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

  // Allow closing modal with Escape key
  setTimeout(() => modal.focus(), 0); // Ensure modal receives focus for keydown
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      modal.remove();
    }
    // Trap focus inside modal
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
  }
  modal.addEventListener('keydown', handleKeyDown);

  const title = document.createElement('h2');
  title.id = 'artifact-modal-title';
  title.textContent = 'Artifacts';
  title.style.marginTop = '0';
  title.style.color = '#4285f4';

  // Add paper title below the modal title
  const paperTitleElem = document.createElement('div');
  paperTitleElem.textContent = paperTitle || '';
  paperTitleElem.style.fontWeight = 'bold';
  paperTitleElem.style.margin = '8px 0 16px 0';
  paperTitleElem.style.fontSize = '1.05em';
  paperTitleElem.style.color = '#222';

  const list = createArtifactList();

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

  content.appendChild(closeBtn);
  content.appendChild(title);
  content.appendChild(paperTitleElem);
  content.appendChild(list);
  modal.appendChild(content);
  document.body.appendChild(modal);

  setTimeout(() => content.focus(), 0);
}

function addArtifactButtons() {
  const entries = document.querySelectorAll('.gs_ri');
  entries.forEach(entry => {
    if (entry.querySelector('.artifact-btn')) return;
    const title = entry.querySelector('.gs_rt');
    // Only add button if the title contains a link (i.e., is a paper, not a citation)
    if (!title || !title.querySelector('a')) return;
    const btn = document.createElement('button');
    btn.textContent = 'Show Artifacts';
    btn.className = 'artifact-btn';
    styleArtifactBtn(btn);
    btn.onclick = (e) => {
      e.stopPropagation();
      // Get the paper title text
      const link = title.querySelector('a');
      let paperTitle = link ? link.textContent.trim() : title.textContent.trim();

      createArtifactModal(paperTitle);
    };
    title.appendChild(btn);
  });
}

addArtifactButtons();
const observer = new MutationObserver(addArtifactButtons);
observer.observe(document.body, { childList: true, subtree: true });