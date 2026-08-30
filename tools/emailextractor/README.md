# Academic Paper Email Extractor

A fast, automated Python tool designed to batch-extract corresponding author email addresses from the first page of academic PDF papers (e.g., ICSE, FSE, ASE, ISSTA, MSR).

It supports standard email formats as well as ACM/IEEE bracketed email groups (e.g., `{author1, author2}@domain.edu`) and automatically enriches extraction results with metadata from `papers.json` (Paper Title, Conference, Year, Authors, and DOI) using a multi-strategy cascading matcher (DOI/URL ID, normalized title, prefix, and fuzzy matching).

---

## Prerequisites

* Python 3.8+ installed on your system.

---

## Quick Start with Virtual Environment (venv)

Using a virtual environment keeps your project dependencies isolated and prevents conflicts with system packages.

### 1. Project Structure

Make sure your project files are structured as follows:

```text
tools/emailextractor/
├── extract_paper_emails.py
├── requirements.txt
├── README.md
└── pdfs/                   # Optional local PDF folder (or point to dataset directories)
```

### 2. Create the Virtual Environment

Open your terminal (macOS/Linux) or Command Prompt/PowerShell (Windows) and navigate to the project directory:

**macOS / Linux:**

```bash
cd tools/emailextractor
python3 -m venv .venv
```

**Windows:**

```powershell
cd tools\emailextractor
python -m venv .venv
```

### 3. Activate the Virtual Environment

**macOS / Linux:**

```bash
source .venv/bin/activate
```

**Windows (Command Prompt):**

```cmd
.venv\Scripts\activate.bat
```

**Windows (PowerShell):**

```powershell
.venv\Scripts\Activate.ps1
```

### 4. Install Dependencies

With the virtual environment active, run:

```bash
pip install -r requirements.txt
```

### 5. Run the Extractor

You can run the extractor on a single conference/year folder or across the entire dataset:

**Batch processing across the ENTIRE dataset (all conferences and years):**
```bash
python extract_paper_emails.py ../dataset
```
*(Recursively scans all subfolders `fse`, `icse`, `issta`, `ase`, processes each year creating local files, and outputs consolidated files in `../dataset/`).*

**Filtering specific conferences in batch mode:**
```bash
python extract_paper_emails.py ../dataset -c icse fse
```

**Processing a specific conference and year folder directly:**
```bash
python extract_paper_emails.py ../dataset/icse/2021
```

**Running on a local `./pdfs` folder:**
```bash
python extract_paper_emails.py ./pdfs
```

**Passing a custom `papers.json` metadata file:**
```bash
python extract_paper_emails.py ./pdfs --papers ../dataset/papers.json
```

### 6. Deactivate the Virtual Environment

When you are done, exit the virtual environment by running:

```bash
deactivate
```

---

## Metadata Cascading Matcher

The tool automatically identifies which paper each PDF belongs to, regardless of how the file is named:
1. **DOI / ACM ID Suffix:** Matches files named like `3715713.pdf`, `3460319.3464795.pdf`, `9678580.pdf`.
2. **Normalized Title Match:** Normalizes filesystem-sanitized names (removes punctuation, accents, colons, quotes) to match full paper titles with 100% accuracy.
3. **Prefix Match:** Handles titles truncated by operating system file path limits.
4. **Fuzzy Match (>= 88%):** Tolerates minor typos or spacing variations.

---

## Output and Results

Once the execution completes, the following files are automatically generated in the target directory:

* `extracted_emails.csv` - CSV spreadsheet with paper file names, metadata (title, conference, year, authors, DOI), extraction status, and email lists.
* `extracted_emails.xlsx` - Excel spreadsheet with the same enriched data.
* `emails_list.json` - Consolidated, deduplicated JSON list containing all unique email addresses.
* `emails_with_papers.json` - Structured JSON array mapping each email directly to its corresponding paper title, conference, year, authors, and DOI for email merge and outreach campaigns.

### Summary Columns (CSV / Excel)

| Column | Description |
| --- | --- |
| `File_Name` | The file name of the PDF document |
| `Paper_Title` | Clean paper title resolved from `papers.json` |
| `Conference` | Conference name (e.g. `ICSE`, `FSE`, `ISSTA`, `ASE`) |
| `Year` | Publication year |
| `DOI` | Digital Object Identifier URL |
| `Authors` | Semicolon-separated list of authors |
| `Status` | `SUCCESS` (emails found) or `NOT_FOUND` (no emails detected) |
| `Email_Count` | Number of unique extracted email addresses |
| `Emails` | List of parsed emails separated by semicolons (`;`) |
| `Match_Type` | Strategy used to match the PDF (`DOI_EXACT`, `TITLE_EXACT`, `TITLE_PREFIX`, `TITLE_FUZZY`) |

### Example `emails_with_papers.json` Entry

```json
{
  "email": "han.zheng@epfl.ch",
  "paper_title": "Towards Understanding Continuous Software Engineering...",
  "conference": "FSE",
  "year": 2025,
  "doi": "https://doi.org/10.1145/3715713",
  "authors": [
    "Han Zheng",
    "Luca Toffalini"
  ],
  "file_name": "3715713.pdf",
  "match_type": "DOI_EXACT"
}
```
