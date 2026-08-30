# Research Tools & Dataset Pipeline

This directory contains modular tools and dataset structures designed to collect academic paper metadata, extract PDF download URLs for papers with artifact badges, and batch-extract author email addresses from PDF papers.

---

## Directory Structure

```text
tools/
├── dataset/             Data storage for all conferences and publication years
├── papercollector/      Tool for scraping ACM DL metadata and merging papers.json files
├── pdfurlextractor/     Tool for extracting direct PDF download links for badged papers
└── emailextractor/      Tool for batch-extracting author emails and linking to metadata
```

---

## Modules Overview

### 1. [dataset/](dataset/)
Stores official paper metadata and downloaded PDF files, organized by conference and year:
* `tools/dataset/<conference>/<year>/papers.json` - Individual conference metadata.
* `tools/dataset/<conference>/<year>/pdfs/` - Downloaded PDF papers (named by DOI suffix e.g. `3715713.pdf` or normalized paper title).
* `tools/dataset/papers.json` - Consolidated global dataset of all papers.

### 2. [papercollector/](papercollector/README.md)
Collects paper metadata and artifact badges from the ACM Digital Library and merges individual files into the global dataset:
* `getPapersWithArtifactBadge.js` - Browser console script to scrape ACM Digital Library proceedings.
* `merge_papers.py` - Merges and deduplicates conference `papers.json` files into `tools/dataset/papers.json`.
* For detailed usage, see [papercollector/README.md](papercollector/README.md).

### 3. [pdfurlextractor/](pdfurlextractor/README.md)
Extracts direct PDF download links for papers with artifact badges:
* `extract_badged_pdf_urls.py` - Parses `papers.json` and outputs `badged_pdf_urls.json` per conference year and globally.
* For detailed usage, see [pdfurlextractor/README.md](pdfurlextractor/README.md).

### 4. [emailextractor/](emailextractor/README.md)
Extracts corresponding author emails from the first page of PDF papers and correlates each email with paper metadata:
* `extract_paper_emails.py` - Performs cascading matching (DOI/URL ID, normalized title, prefix, fuzzy) and outputs enriched spreadsheets (`.csv`, `.xlsx`) and structured JSON files (`emails_list.json`, `emails_with_papers.json`).
* For setup and detailed command options, see [emailextractor/README.md](emailextractor/README.md).

---

## End-to-End Pipeline Workflow

To add and process a new conference year (e.g., `tools/dataset/msr/2025`):

1. **Scrape Metadata:** Run `getPapersWithArtifactBadge.js` on the ACM DL proceedings page and save the output to `tools/dataset/msr/2025/papers.json`.
2. **Consolidate Dataset:** Run `python3 tools/papercollector/merge_papers.py` to rebuild `tools/dataset/papers.json`.
3. **Extract Download URLs:** Run `python3 tools/pdfurlextractor/extract_badged_pdf_urls.py tools/dataset/msr/2025` to generate download links.
4. **Download PDFs:** Save the downloaded PDF files into `tools/dataset/msr/2025/pdfs/`.
5. **Extract Emails:** Run `python tools/emailextractor/extract_paper_emails.py tools/dataset/msr/2025` to extract emails and generate matched metadata reports.
