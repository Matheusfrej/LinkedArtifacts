# Badged PDF URL Extractor

A Python tool designed to extract direct PDF download URLs for papers that received artifact badges from `papers.json` dataset files.

---

## Usage

### 1. Extract URLs for the Entire Dataset (All Conferences and Years)

```bash
cd tools/pdfurlextractor
python3 extract_badged_pdf_urls.py
```
*(Generates individual `badged_pdf_urls.json` files in each conference year folder and creates a consolidated file in `tools/dataset/badged_pdf_urls.json`)*.

---

### 2. Extract URLs for a Specific Conference and Year Folder

```bash
python3 extract_badged_pdf_urls.py ../dataset/fse/2025
```

---

### 3. Extract URLs from Specific Input and Output File Paths

```bash
python3 extract_badged_pdf_urls.py path/to/papers.json path/to/badged_pdf_urls.json
```
