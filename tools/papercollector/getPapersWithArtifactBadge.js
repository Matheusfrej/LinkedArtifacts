/**
 * ACM Digital Library Paper & Badge Scraper
 * -----------------------------------------
 * Paste and run this script directly in the Developer Tools Console (F12)
 * on any ACM Digital Library Proceedings page (e.g. ICSE, FSE, ISSTA).
 * 
 * It will parse all paper entries on the page, extracting:
 * - Title, DOI, ACM URL, Article Type
 * - Authors list
 * - Artifact Badges (Available, Functional, Reusable, Reproduced, Replicated)
 * 
 * Output: Copy the resulting array and save it into the conference year's `papers.json`
 * (e.g. `tools/dataset/icse/2025/papers.json`).
 */

const CONFERENCE = 'ICSE'; // MODIFY HERE: 'ICSE', 'FSE', 'ISSTA', 'ASE', etc.
const YEAR = 2025;         // MODIFY HERE: 2021, 2022, 2023, 2024, 2025
const SOURCE = 'ACM Digital Library';

const COLLECTION_DATE = new Date().toISOString().split('T')[0];

const ARTIFACT_TYPES = [
  'Available',
  'Functional',
  'Reusable',
  'Reproduced',
  'Replicated'
];

const papers = [...document.querySelectorAll('.issue-item-container')]
  .map(item => {

    // -------------------------
    // Basic information
    // -------------------------

    const title =
      item.querySelector('.issue-item__title a')
        ?.textContent
        .trim() || null;

    const url =
      item.querySelector('.issue-item__title a')
        ?.href || null;

    const doi =
      item.querySelector('.issue-item__doi')
        ?.textContent
        .trim() || null;

    const articleType =
      item.querySelector('.issue-heading')
        ?.textContent
        .trim() || null;


    // -------------------------
    // Authors
    // -------------------------

    const authors = [
      ...item.querySelectorAll('.loa li a span')
    ]
      .map(author => author.textContent.trim())
      .filter(Boolean);


    // -------------------------
    // Artifact badges
    // -------------------------

    const badgeTexts = [
      ...item.querySelectorAll('.badges img')
    ]
      .map(img => img.alt?.trim())
      .filter(Boolean);


    const patterns = {
      Available: /Artifacts Available/i,
      Functional: /Artifacts .*Functional/i,
      Reusable: /Artifacts .*Reusable/i,
      Reproduced: /Artifacts .*Reproduced/i,
      Replicated: /Artifacts .*Replicated/i
    };


    const hasBadge = type =>
      badgeTexts.some(
        badge => patterns[type]?.test(badge)
      );


    // Always maintain this order
    const badges = ARTIFACT_TYPES
      .filter(type => hasBadge(type));


    // -------------------------
    // Return dataset record
    // -------------------------

    return {
      conference: CONFERENCE,
      year: YEAR,
      source: SOURCE,
      collection_date: COLLECTION_DATE,

      title,
      doi,
      authors,

      badges,

      artifact_available: hasBadge('Available'),
      artifact_functional: hasBadge('Functional'),
      artifact_reusable: hasBadge('Reusable'),
      results_reproduced: hasBadge('Reproduced'),
      results_replicated: hasBadge('Replicated'),

      articleType,
      url
    };
  })
  .filter(paper => paper.title);


// -------------------------
// Statistics & Display
// -------------------------

console.log(`Conference: ${CONFERENCE}`);
console.log(`Year: ${YEAR}`);
console.log(`Source: ${SOURCE}`);
console.log(`Collection date: ${COLLECTION_DATE}`);
console.log(`Total papers: ${papers.length}`);
console.log(`Papers with badges: ${papers.filter(p => p.badges.length > 0).length}`);

for (const type of ARTIFACT_TYPES) {
  console.log(`${type}: ${papers.filter(p => p.badges.includes(type)).length}`);
}

console.table(papers);

// To copy JSON directly to clipboard:
// copy(JSON.stringify(papers, null, 4));
// console.log("✓ Papers JSON copied to clipboard!");
