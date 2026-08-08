const fs = require("fs");
const csv = require("csv-parser");

const DATASET_1 = "papers_new.csv";
const DATASET_2 = "papers.csv";
const OUTPUT = "papers_new_with_badges.csv";

// --------------------------------------------------
// Read CSV
// --------------------------------------------------

function readCsv(file) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(file)
            .pipe(csv())
            .on("data", row => results.push(row))
            .on("end", () => resolve(results))
            .on("error", reject);
    });
}


// --------------------------------------------------
// Main
// --------------------------------------------------

async function main() {
    console.log("Reading CSV files...");

    const dataset1 = await readCsv(DATASET_1);
    const dataset2 = await readCsv(DATASET_2);

    console.log(`Dataset 1: ${dataset1.length} papers`);
    console.log(`Dataset 2: ${dataset2.length} papers`);

    // --------------------------------------------------
    // Create lookup table from Dataset 2
    // --------------------------------------------------

    const badgesByDoi = new Map();

    for (const paper of dataset2) {
        if (!paper.doi) continue;
        badgesByDoi.set(paper.doi, paper.badges || "");
    }

    // --------------------------------------------------
    // Add badges to Dataset 1
    // --------------------------------------------------

    let matched = 0;
    let notMatched = 0;

    const merged = dataset1.map(paper => {
        const badges = badgesByDoi.get(paper.doi);

        if (badges !== undefined) {
            matched++;
        } else {
            notMatched++;
        }

        return {
            ...paper,
            badges: badges || ""
        };
    });

    // --------------------------------------------------
    // Convert to CSV
    // --------------------------------------------------

    if (merged.length === 0) {
        console.log("Dataset 1 is empty.");
        return;
    }

    const columns = Object.keys(merged[0]);

    const escapeCsv = value => {
        if (value === null || value === undefined) {
            return "";
        }

        value = String(value);

        if (
            value.includes(",") ||
            value.includes('"') ||
            value.includes("\n") ||
            value.includes("\r")
        ) {
            return `"${value.replace(/"/g, '""')}"`;
        }

        return value;
    };

    const csvContent = [
        columns.join(","),
        ...merged.map(row =>
            columns
                .map(column => escapeCsv(row[column]))
                .join(",")
        )
    ].join("\n");

    fs.writeFileSync(
        OUTPUT,
        csvContent,
        "utf8"
    );

    // --------------------------------------------------
    // Statistics
    // --------------------------------------------------

    console.log("\nMerge completed!");
    console.log(`Output: ${OUTPUT}`);
    console.log(`Total papers: ${dataset1.length}`);
    console.log(`Matched with Dataset 2: ${matched}`);
    console.log(`Not found in Dataset 2: ${notMatched}`);
}

main().catch(error => {
    console.error("Error:", error);
});