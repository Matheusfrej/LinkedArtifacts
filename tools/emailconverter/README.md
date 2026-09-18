# Email JSON to Excel Converter (`emailconverter`)

A lightweight Python tool to convert structured paper email datasets (`emails_with_papers.json`) into Microsoft Excel spreadsheets (`.xlsx`).

---

## Key Features

* **Automatic Deduplication by Email (Default):** Ensures each email address appears only once in the generated spreadsheet, keeping the first encountered paper metadata.
* **Optional Preservation of Duplicates:** Allows generating the full dataset without deduplication via `--keep-duplicates` (or `--no-dedup`) when you want to see all papers authored by each person.
* **List Formatting:** Cleanly converts author lists `["Author 1", "Author 2"]` into semicolon-separated text (`Author 1; Author 2`) suitable for Excel filters.
* **Auto-Adjusted Column Widths:** Automatically adjusts cell widths in the `.xlsx` file for clean viewing.

---

## Prerequisites

* Python 3.8+ installed on your system.

---

## Setup & Virtual Environment (venv)

Using a virtual environment prevents conflicts with system packages.

### Option A: Create a Dedicated Virtual Environment

1. **Navigate to the tool directory:**
   ```bash
   cd tools/emailconverter
   ```

2. **Create the virtual environment:**
   * **macOS / Linux:**
     ```bash
     python3 -m venv .venv
     ```
   * **Windows:**
     ```powershell
     python -m venv .venv
     ```

3. **Activate the virtual environment:**
   * **macOS / Linux:**
     ```bash
     source .venv/bin/activate
     ```
   * **Windows (Command Prompt):**
     ```cmd
     .venv\Scripts\activate.bat
     ```
   * **Windows (PowerShell):**
     ```powershell
     .venv\Scripts\Activate.ps1
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

---

### Option B: Reuse the Existing Email Extractor venv

If you already created the virtual environment in `tools/emailextractor`, you can run the converter directly with it:

```bash
# From repository root:
tools/emailextractor/.venv/bin/python tools/emailconverter/convert_emails_to_xlsx.py
```

---

## Usage

### 1. Default Run (Deduplication Enabled)

By default, the script reads `tools/dataset/emails_with_papers.json` and outputs `tools/dataset/emails_with_papers.xlsx`, keeping only the first paper for each unique email address:

```bash
python3 convert_emails_to_xlsx.py
```

Output:
```text
Reading JSON from: /home/mathe/mestrado/LinkedArtifacts/tools/dataset/emails_with_papers.json
Deduplication enabled: all 2180 emails are already unique.
Writing 2180 records to: /home/mathe/mestrado/LinkedArtifacts/tools/dataset/emails_with_papers.xlsx
Done! Excel file generated: /home/mathe/mestrado/LinkedArtifacts/tools/dataset/emails_with_papers.xlsx
```

### 2. Keep Duplicate Emails (`--keep-duplicates`)

If you want the spreadsheet to contain all paper occurrences for authors who published multiple papers, pass `--keep-duplicates` (or `--allow-duplicates` / `--no-dedup`):

```bash
python3 convert_emails_to_xlsx.py --keep-duplicates
```

### 3. Custom Input and Output Paths

You can convert any custom JSON file or output to a specific path:

```bash
python3 convert_emails_to_xlsx.py -i path/to/input.json -o path/to/output.xlsx
```

---

## Command-Line Arguments Reference

| Argument | Description | Default |
| :--- | :--- | :--- |
| `-i`, `--input` | Path to the source JSON file. | `tools/dataset/emails_with_papers.json` |
| `-o`, `--output` | Destination path for the `.xlsx` file. | Same folder & basename as input with `.xlsx` |
| `--keep-duplicates`, `--no-dedup` | Disable deduplication and keep all occurrences of each email. | `False` (deduplication is enabled by default) |

---

## Output Spreadsheet Schema

| Column | Description |
| :--- | :--- |
| `email` | Extracted author email address. |
| `paper_title` | Title of the paper. |
| `conference` | Conference acronym (e.g. `ICSE`, `FSE`, `ISSTA`, `ASE`). |
| `year` | Publication year (e.g. `2021`, `2024`). |
| `doi` | Paper DOI URL. |
| `authors` | Semicolon-separated list of authors (`Author A; Author B`). |
| `file_name` | Name of the PDF file from which the email was extracted. |
| `match_type` | Cascading metadata match strategy used (e.g. `DOI_EXACT`, `TITLE_NORMALIZED`). |

