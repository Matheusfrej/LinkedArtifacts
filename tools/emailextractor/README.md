# Academic Paper Email Extractor

A fast and automated Python tool designed to batch-extract corresponding author email addresses from the first page of academic PDF papers (e.g., ICSE, FSE, ASE, ISSTA, MSR).

It supports standard email formats as well as ACM/IEEE bracketed email groups (e.g., `{author1, author2}@domain.edu`) and outputs summary reports in both CSV and Excel format.

---

## 📋 Prerequisites

* **Python 3.8+** installed on your system.

---

## 🚀 Quick Start with Virtual Environment (`venv`)

Using a virtual environment keeps your project dependencies isolated and prevents conflicts with system packages.

### 1. Clone or Download the Project

Make sure your project files are structured as follows:

```text
academic-email-extractor/
├── extract_paper_emails.py
├── requirements.txt
├── README.md
└── pdfs/                   # Put your downloaded PDF papers here
```

### 2. Create the Virtual Environment

Open your terminal (macOS/Linux) or Command Prompt/PowerShell (Windows) and navigate to the project directory:

**macOS / Linux:**

```bash
cd /path/to/academic-email-extractor
```

**Windows:**

```powershell
cd C:\path\to\academic-email-extractor
```

Create a virtual environment named `.venv`:

**macOS / Linux:**

```bash
python3 -m venv .venv
```

**Windows:**

```powershell
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

> **Note:** If PowerShell blocks script execution, run:
>
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```

When activated, you will see `(.venv)` in front of your command prompt.

### 4. Install Dependencies

With the virtual environment active, run:

```bash
pip install -r requirements.txt
```

### 5. Run the Extractor

You can run the extractor pointing to any folder containing PDFs and specify where the output files should be generated:

**Default (reads `./pdfs` and saves in `./`):**
```bash
python extract_paper_emails.py ./pdfs
```

**Directly inside a dataset year folder (e.g. `../dataset/icse/2025`):**
```bash
python extract_paper_emails.py ../dataset/icse/2025
```
*(If the folder has a `pdfs/` subfolder or contains `.pdf` files directly, it will detect them and save all output files directly inside `../dataset/icse/2025/`)*

**Specifying PDF folder and Output folder separately:**
```bash
python extract_paper_emails.py ./pdfs ../dataset/icse/2025
```

### 6. Deactivate the Virtual Environment

When you are done, you can exit the virtual environment by running:

```bash
deactivate
```

---

## 📊 Output & Results

Once the execution completes, the following files are automatically generated in the target directory:

* `extracted_emails.csv` — CSV spreadsheet with paper file names, status, and email lists.
* `extracted_emails.xlsx` — Excel spreadsheet with the same data.
* `emails_list.json` — Consolidated, deduplicated JSON list containing all unique email addresses.

### Summary Columns (CSV / Excel)

| Column        | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `File_Name`   | The file name of the PDF document                            |
| `Status`      | `SUCCESS` (emails found) or `NOT_FOUND` (no emails detected) |
| `Email_Count` | Number of unique extracted email addresses                   |
| `Emails`      | List of parsed emails separated by semicolons (`;`)          |

### Recommended Validation Workflow

Open `extracted_emails.xlsx` in **Excel** or **LibreOffice Calc** and filter by:

```text
Status == NOT_FOUND
```

This allows you to quickly identify papers that require manual inspection or an additional lookup using sources such as **DBLP** or **Google Scholar**.
