const fs = require("fs");
const csv = require("csv-parser");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const results = [];

async function run() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await new Promise((resolve, reject) => {
      fs.createReadStream("papers.csv")
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    for (const row of results) {
      const { doi, title, links } = row;

      // Insert paper
      const paperRes = await client.query(
        `
        INSERT INTO papers (title, doi)
        VALUES ($1, $2)
        RETURNING id
        `,
        [title, doi]
      );

      const paperId = paperRes.rows[0].id;

      // Insert artifacts
      if (links && links.trim() !== "") {
        const urls = links.split(" ").filter(Boolean);

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
    console.log("✅ Import completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Import failed:", err);
  } finally {
    client.release();
    pool.end();
  }
}

run();