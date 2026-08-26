const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Pool } = require("pg");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ============================================================================
// 1. CANONICAL CONSTANTS & NORMALIZERS
// ============================================================================

const CANONICAL_BADGES = {
  AVAILABLE: "Available",
  FUNCTIONAL: "Evaluated & Functional",
  REUSABLE: "Evaluated & Reusable",
  REPRODUCED: "Results Reproduced",
  REPLICATED: "Results Replicated",
};

/**
 * Normalizes a DOI string to "10.xxxx/..." or null.
 * Strips common URL prefixes (https://doi.org/, dx.doi.org, doi:).
 */
function normalizeDoi(rawDoi) {
  if (!rawDoi || typeof rawDoi !== "string") {
    return null;
  }
  let doi = rawDoi.trim();
  if (!doi) {
    return null;
  }
  doi = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  doi = doi.replace(/^doi:\s*/i, "");
  doi = doi.trim();
  return doi || null;
}

/**
 * Parses badge names from text (ACM strings, short names) or boolean flags
 * into a deduplicated list of canonical database badges.
 */
function parseBadges(input, flags = {}) {
  const result = new Set();

  const matchBadge = (text) => {
    if (!text || typeof text !== "string") return;
    const normalized = text.trim().toLowerCase();
    if (!normalized) return;

    if (normalized.includes("available")) {
      result.add(CANONICAL_BADGES.AVAILABLE);
    }
    if (normalized.includes("functional")) {
      result.add(CANONICAL_BADGES.FUNCTIONAL);
    }
    if (normalized.includes("reusable")) {
      result.add(CANONICAL_BADGES.REUSABLE);
    }
    if (normalized.includes("reproduced")) {
      result.add(CANONICAL_BADGES.REPRODUCED);
    }
    if (normalized.includes("replicated")) {
      result.add(CANONICAL_BADGES.REPLICATED);
    }
  };

  if (typeof input === "string") {
    input
      .split(/[;,]/)
      .map((b) => b.trim())
      .filter(Boolean)
      .forEach(matchBadge);
  } else if (Array.isArray(input)) {
    input.forEach((item) => {
      if (typeof item === "string") {
        matchBadge(item);
      }
    });
  }

  if (flags.artifact_available) result.add(CANONICAL_BADGES.AVAILABLE);
  if (flags.artifact_functional) result.add(CANONICAL_BADGES.FUNCTIONAL);
  if (flags.artifact_reusable) result.add(CANONICAL_BADGES.REUSABLE);
  if (flags.results_reproduced) result.add(CANONICAL_BADGES.REPRODUCED);
  if (flags.results_replicated) result.add(CANONICAL_BADGES.REPLICATED);

  return Array.from(result);
}

// ============================================================================
// 2. DATASET ADAPTERS (Transform each raw format to CommonPaper)
// ============================================================================

/**
 * Common Paper Data Model
 * @typedef {Object} CommonPaper
 * @property {string} title
 * @property {string|null} doi
 * @property {string} venue
 * @property {number} year
 * @property {string} authors
 * @property {number|null} pageCount
 * @property {string[]} badges
 * @property {string[]} artifacts
 */

/**
 * Adapts a single CSV row into CommonPaper format.
 */
function adaptCsvPaper(row) {
  const title = (row.title || "").trim();
  if (!title) return null;

  const doi = normalizeDoi(row.doi);
  const venue = (row.venue || "").trim();
  const year = row.year ? parseInt(row.year, 10) : 0;
  const authors = (row.authors || "").trim();
  const pageCount =
    row.pageCount && row.pageCount.trim() !== ""
      ? parseInt(row.pageCount, 10)
      : null;

  const badges = parseBadges(row.badges);

  const artifacts = [];
  if (row.links && typeof row.links === "string" && row.links.trim() !== "") {
    const urls = row.links
      .split(/\s+/)
      .map((url) => url.trim())
      .filter(Boolean);
    artifacts.push(...urls);
  }

  return {
    title,
    doi,
    venue,
    year,
    authors,
    pageCount: Number.isNaN(pageCount) ? null : pageCount,
    badges,
    artifacts,
  };
}

/**
 * Adapts a single JSON item into CommonPaper format.
 */
function adaptJsonPaper(item) {
  const title = (item.title || "").trim();
  if (!title) return null;

  const doi = normalizeDoi(item.doi);
  const venue = (item.conference || item.venue || "").trim();
  const year = item.year ? parseInt(item.year, 10) : 0;

  let authors = "";
  if (Array.isArray(item.authors)) {
    authors = item.authors
      .map((a) => (typeof a === "string" ? a.trim() : ""))
      .filter(Boolean)
      .join("; ");
  } else if (typeof item.authors === "string") {
    authors = item.authors.trim();
  }

  let rawPageCount = item.pageCount ?? item.page_count ?? null;
  let pageCount = null;
  if (rawPageCount !== null && rawPageCount !== undefined && rawPageCount !== "") {
    const parsed = parseInt(rawPageCount, 10);
    if (!Number.isNaN(parsed)) {
      pageCount = parsed;
    }
  }

  const badges = parseBadges(item.badges, {
    artifact_available: item.artifact_available,
    artifact_functional: item.artifact_functional,
    artifact_reusable: item.artifact_reusable,
    results_reproduced: item.results_reproduced,
    results_replicated: item.results_replicated,
  });

  const artifacts = [];
  const rawLinks = item.artifact_links || item.links || [];
  const linkList = Array.isArray(rawLinks)
    ? rawLinks
    : typeof rawLinks === "string"
    ? rawLinks.split(/\s+/).filter(Boolean)
    : [];

  for (const link of linkList) {
    if (typeof link === "string" && link.trim() !== "") {
      artifacts.push(link.trim());
    } else if (typeof link === "object" && link && link.url) {
      artifacts.push(link.url.trim());
    }
  }

  return {
    title,
    doi,
    venue,
    year,
    authors,
    pageCount,
    badges,
    artifacts,
  };
}

/**
 * Reads and adapts a CSV dataset file.
 * @returns {Promise<CommonPaper[]>}
 */
async function loadCsvDataset(filePath) {
  return new Promise((resolve, reject) => {
    const papers = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const paper = adaptCsvPaper(row);
        if (paper) papers.push(paper);
      })
      .on("end", () => resolve(papers))
      .on("error", reject);
  });
}

/**
 * Reads and adapts a JSON dataset file.
 * @returns {Promise<CommonPaper[]>}
 */
async function loadJsonDataset(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const rawList = JSON.parse(content);
  if (!Array.isArray(rawList)) {
    throw new Error(`Expected JSON file at ${filePath} to contain an array of papers.`);
  }

  const papers = [];
  for (const item of rawList) {
    const paper = adaptJsonPaper(item);
    if (paper) papers.push(paper);
  }
  return papers;
}

// ============================================================================
// 3. COMMON DATABASE OPERATIONS
// ============================================================================

/**
 * Seeds and retrieves the 5 canonical badges from the database.
 */
async function ensureBadges(client) {
  const badgeNames = [
    CANONICAL_BADGES.AVAILABLE,
    CANONICAL_BADGES.FUNCTIONAL,
    CANONICAL_BADGES.REUSABLE,
    CANONICAL_BADGES.REPRODUCED,
    CANONICAL_BADGES.REPLICATED,
  ];

  const badgeIds = {};

  for (const badgeName of badgeNames) {
    const badgeRes = await client.query(
      `
      INSERT INTO badges (name)
      VALUES ($1)
      ON CONFLICT (name)
      DO UPDATE SET name = EXCLUDED.name
      RETURNING id
      `,
      [badgeName]
    );

    badgeIds[badgeName] = badgeRes.rows[0].id;
  }

  return badgeIds;
}

/**
 * Inserts a single CommonPaper into the database.
 * Uses strict INSERT statements to fail on duplicates.
 */
async function insertPaper(client, paper, badgeIds) {
  // 1. Insert paper
  const paperRes = await client.query(
    `
    INSERT INTO papers (
      title,
      doi,
      venue,
      year,
      authors,
      page_count
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
    `,
    [
      paper.title,
      paper.doi || null,
      paper.venue,
      paper.year,
      paper.authors,
      paper.pageCount !== null && paper.pageCount !== undefined
        ? Number(paper.pageCount)
        : null,
    ]
  );

  const paperId = paperRes.rows[0].id;

  // 2. Insert paper <-> badges relationships
  for (const badgeName of paper.badges) {
    const badgeId = badgeIds[badgeName];
    if (!badgeId) {
      throw new Error(`Badge ID not found for canonical badge: "${badgeName}"`);
    }

    await client.query(
      `
      INSERT INTO paper_badges (paper_id, badge_id)
      VALUES ($1, $2)
      `,
      [paperId, badgeId]
    );
  }

  // 3. Insert artifacts
  if (Array.isArray(paper.artifacts) && paper.artifacts.length > 0) {
    for (const url of paper.artifacts) {
      if (!url || typeof url !== "string" || url.trim() === "") continue;

      await client.query(
        `
        INSERT INTO artifacts (url, paper_id)
        VALUES ($1, $2)
        `,
        [url.trim(), paperId]
      );
    }
  }

  return paperId;
}

/**
 * Ingests an array of CommonPaper objects into the database.
 */
async function importDataset(client, papers, badgeIds, datasetName) {
  console.log(`\n--- Importing Dataset: ${datasetName} (${papers.length} papers) ---`);

  let count = 0;
  for (const paper of papers) {
    await insertPaper(client, paper, badgeIds);
    count++;
    if (count % 250 === 0 || count === papers.length) {
      console.log(`  [${datasetName}] Processed ${count}/${papers.length} papers...`);
    }
  }

  console.log(`✓ [${datasetName}] Successfully imported ${count} papers.`);
  return count;
}

// ============================================================================
// 4. MAIN EXECUTION
// ============================================================================

function resolveDatasetPaths() {
  const args = process.argv.slice(2);
  const sourceArg = args.find((a) => a.startsWith("--source="));
  const source = sourceArg ? sourceArg.split("=")[1].toLowerCase() : "all";

  const customCsvArg = args.find((a) => a.startsWith("--csv="));
  const customJsonArg = args.find((a) => a.startsWith("--json="));

  const csvPath = customCsvArg
    ? path.resolve(customCsvArg.split("=")[1])
    : path.join(__dirname, "artifact_url/papers_new_with_badges.csv");

  // Check possible JSON dataset locations
  let jsonPath = customJsonArg ? path.resolve(customJsonArg.split("=")[1]) : null;
  if (!jsonPath) {
    const candidates = [
      path.join(__dirname, "linked_artifacts_api/papers.json"),
      path.join(__dirname, "linked_artifacts_dataset/papers.json"),
      path.join(__dirname, "../tools/dataset/papers.json"),
    ];
    jsonPath = candidates.find((p) => fs.existsSync(p)) || candidates[0];
  }

  return { source, csvPath, jsonPath };
}

async function run() {
  const { source, csvPath, jsonPath } = resolveDatasetPaths();

  console.log("==================================================");
  console.log("             DATASET IMPORT PIPELINE              ");
  console.log("==================================================");
  console.log(`Source mode : ${source}`);
  console.log(`CSV path    : ${csvPath} (${fs.existsSync(csvPath) ? "found" : "NOT found"})`);
  console.log(`JSON path   : ${jsonPath} (${fs.existsSync(jsonPath) ? "found" : "NOT found"})`);
  console.log("==================================================\n");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Ensure canonical badges exist in DB
    const badgeIds = await ensureBadges(client);
    console.log("Canonical Badges in DB:", badgeIds);

    let totalImported = 0;

    // 2. Import CSV dataset
    if (source === "all" || source === "csv") {
      if (fs.existsSync(csvPath)) {
        console.log(`\nLoading CSV from ${csvPath}...`);
        const csvPapers = await loadCsvDataset(csvPath);
        const imported = await importDataset(client, csvPapers, badgeIds, "CSV Dataset");
        totalImported += imported;
      } else if (source === "csv") {
        throw new Error(`CSV file not found at: ${csvPath}`);
      } else {
        console.log(`[Info] Skipping CSV dataset (file not found: ${csvPath})`);
      }
    }

    // 3. Import JSON dataset
    if (source === "all" || source === "json") {
      if (fs.existsSync(jsonPath)) {
        console.log(`\nLoading JSON from ${jsonPath}...`);
        const jsonPapers = await loadJsonDataset(jsonPath);
        const imported = await importDataset(client, jsonPapers, badgeIds, "JSON Dataset");
        totalImported += imported;
      } else if (source === "json") {
        throw new Error(`JSON file not found at: ${jsonPath}`);
      } else {
        console.log(`[Info] Skipping JSON dataset (file not found: ${jsonPath})`);
      }
    }

    await client.query("COMMIT");
    console.log(`\n✅ Import finished successfully! Total papers imported: ${totalImported}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\n❌ Import failed (transaction rolled back):", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Export adapters and loaders for programmatic usage or testing
module.exports = {
  CANONICAL_BADGES,
  normalizeDoi,
  parseBadges,
  adaptCsvPaper,
  adaptJsonPaper,
  loadCsvDataset,
  loadJsonDataset,
  ensureBadges,
  insertPaper,
  importDataset,
};

// Execute if run directly from CLI
if (require.main === module) {
  run();
}