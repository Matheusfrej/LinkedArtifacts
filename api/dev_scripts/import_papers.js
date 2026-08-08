const fs = require("fs");
const csv = require("csv-parser");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const results = [];

/**
 * Maps the raw badge names from ACM to the canonical
 * badge names used in LinkedArtifacts.
 */
const BADGE_MAPPING = {
  available: "Available",
  functional: "Evaluated & Functional",
  reusable: "Evaluated & Reusable",
  reproduced: "Results Reproduced",
  replicated: "Results Replicated",
};

/**
 * Converts the raw ACM badges into canonical LinkedArtifacts badges.
 *
 * Examples:
 *
 * "Artifacts Available / v1.1"
 *   -> ["Available"]
 *
 * "Artifacts Available; Artifacts Evaluated & Functional / v1.1"
 *   -> ["Available", "Evaluated & Functional"]
 *
 * "Artifacts Available; Artifacts Evaluated & Reusable; Results Reproduced / v1.1"
 *   -> ["Available", "Evaluated & Reusable", "Results Reproduced"]
 */
function parseBadges(badges) {
  if (!badges || badges.trim() === "") {
    return [];
  }

  const result = new Set();

  const rawBadges = badges
    .split(";")
    .map((badge) => badge.trim())
    .filter(Boolean);

  for (const badge of rawBadges) {
    const normalized = badge.toLowerCase();

    if (normalized.startsWith("artifacts available")) {
      result.add(BADGE_MAPPING.available);
    }

    if (normalized.startsWith("artifacts evaluated & functional")) {
      result.add(BADGE_MAPPING.functional);
    }

    if (normalized.startsWith("artifacts evaluated & reusable")) {
      result.add(BADGE_MAPPING.reusable);
    }

    if (normalized.startsWith("results reproduced")) {
      result.add(BADGE_MAPPING.reproduced);
    }

    if (normalized.startsWith("results replicated")) {
      result.add(BADGE_MAPPING.replicated);
    }
  }

  return Array.from(result);
}

async function run() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Read CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream("papers_new_with_badges.csv")
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    /*
     * Create/find all badges before importing papers.
     *
     * This makes sure the five canonical badges exist
     * in the database.
     */
    const badgeNames = [
      "Available",
      "Evaluated & Functional",
      "Evaluated & Reusable",
      "Results Reproduced",
      "Results Replicated",
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

    console.log("Badges:", badgeIds);

    /*
     * Import papers
     */
    for (const row of results) {
      const {
        doi,
        title,
        links,
        venue,
        year,
        authors,
        pageCount,
        badges,
      } = row;

      console.log(`\nImporting: ${title}`);

      // Parse badges before inserting the paper
      const parsedBadges = parseBadges(badges);

      console.log("Badges:", parsedBadges);

      /*
       * Insert paper
       */
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
          title,
          doi || null,
          venue,
          Number(year),
          authors,
          Number(pageCount),
        ]
      );

      const paperId = paperRes.rows[0].id;

      /*
       * Insert paper <-> badges relationships
       */
      for (const badgeName of parsedBadges) {
        const badgeId = badgeIds[badgeName];

        await client.query(
          `
          INSERT INTO paper_badges (paper_id, badge_id)
          VALUES ($1, $2)
          ON CONFLICT (paper_id, badge_id)
          DO NOTHING
          `,
          [paperId, badgeId]
        );
      }

      /*
       * Insert artifacts
       */
      if (links && links.trim() !== "") {
        const urls = links
          .split(/\s+/)
          .map((url) => url.trim())
          .filter(Boolean);

        for (const url of urls) {
          await client.query(
            `
            INSERT INTO artifacts (url, paper_id)
            VALUES ($1, $2)
            `,
            [url, paperId]
          );
        }
      }
    }

    await client.query("COMMIT");

    console.log("\n✅ Import completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("❌ Import failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();