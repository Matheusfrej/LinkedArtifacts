"""
Academic Paper Email Extractor
--------------------------------
Reads all PDF files in a given directory, extracts text from the first page (where authors and emails reside),
applies robust Regular Expression (Regex) patterns — including grouped bracket formats like {author1, author2}@domain.edu —
and outputs a detailed summary spreadsheet (CSV & XLSX) flagging successes and failures.
"""

import os
import re
import glob
import json
import pandas as pd
from typing import List, Set

try:
    import pdfplumber
    PDF_ENGINE = "pdfplumber"
except ImportError:
    try:
        import pypdf
        PDF_ENGINE = "pypdf"
    except ImportError:
        PDF_ENGINE = None

# 1. Standard pattern for direct emails (e.g., john.doe@cs.univ.edu)
EMAIL_PATTERN = re.compile(
    r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
)

# 2. Pattern for ACM/IEEE bracket-grouped emails:
# e.g., {alice, bob.smith, carl}@cs.cmu.edu or {a, b}@univ.ac.uk
BRACKETED_EMAIL_PATTERN = re.compile(
    r'\{([a-zA-Z0-9_.,\s+-]+)\}\s*@\s*([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)'
)

# Domain / link false positives commonly found in papers
IGNORED_DOMAINS = {"example.com", "domain.com", "email.com", "github.com", "zenodo.org", "doi.org"}


def clean_email(email_str: str) -> str:
    """Removes trailing and leading punctuation."""
    return email_str.strip().strip(".,;:<>(){}[]\"'")


def extract_emails_from_text(text: str) -> List[str]:
    """Extracts standard and bracket-grouped emails from text."""
    if not text:
        return []

    found_emails: Set[str] = set()

    # Bracketed format: {user1, user2}@domain.com
    for match in BRACKETED_EMAIL_PATTERN.finditer(text):
        users_raw, domain = match.groups()
        users = [u.strip() for u in users_raw.replace(",", " ").split() if u.strip()]
        for u in users:
            clean_u = clean_email(u)
            if clean_u and not clean_u.startswith("@"):
                found_emails.add(f"{clean_u}@{domain.strip()}".lower())

    # Standard format
    for match in EMAIL_PATTERN.findall(text):
        cleaned = clean_email(match)
        if "@" in cleaned:
            domain = cleaned.split("@")[1].lower()
            if domain not in IGNORED_DOMAINS and len(cleaned.split("@")[0]) > 1:
                found_emails.add(cleaned.lower())

    return sorted(list(found_emails))


def extract_first_page_text_pdfplumber(pdf_path: str) -> str:
    """Extracts first page text using pdfplumber."""
    import pdfplumber
    with pdfplumber.open(pdf_path) as pdf:
        if len(pdf.pages) > 0:
            return pdf.pages[0].extract_text() or ""
    return ""


def extract_first_page_text_pypdf(pdf_path: str) -> str:
    """Fallback text extraction using pypdf."""
    import pypdf
    reader = pypdf.PdfReader(pdf_path)
    if len(reader.pages) > 0:
        return reader.pages[0].extract_text() or ""
    return ""


def extract_first_page_text(pdf_path: str) -> str:
    """Extracts text using available PDF engine."""
    if PDF_ENGINE == "pdfplumber":
        try:
            return extract_first_page_text_pdfplumber(pdf_path)
        except Exception:
            pass
    try:
        return extract_first_page_text_pypdf(pdf_path)
    except Exception as e:
        print(f"[Warning] Could not read {os.path.basename(pdf_path)}: {e}")
        return ""


def process_pdf_folder(folder_path: str, output_dir: str = None) -> pd.DataFrame:
    """
    Processes all PDFs in folder and generates:
      1. extracted_emails.csv
      2. extracted_emails.xlsx
      3. emails_list.json (unique deduplicated list of emails)
    all saved directly in output_dir (or folder_path by default).
    """
    # If folder_path doesn't have PDFs directly, check if it has a 'pdfs/' subfolder
    search_path = folder_path
    pdf_files = glob.glob(os.path.join(search_path, "*.pdf"))
    if not pdf_files and os.path.isdir(os.path.join(folder_path, "pdfs")):
        search_path = os.path.join(folder_path, "pdfs")
        pdf_files = glob.glob(os.path.join(search_path, "*.pdf"))

    if not pdf_files:
        print(f"No PDF files found in: {folder_path} (or {os.path.join(folder_path, 'pdfs')})")
        return pd.DataFrame()

    # Determine destination folder for output files
    dest_dir = output_dir if output_dir else folder_path
    os.makedirs(dest_dir, exist_ok=True)

    csv_path = os.path.join(dest_dir, "extracted_emails.csv")
    xlsx_path = os.path.join(dest_dir, "extracted_emails.xlsx")
    json_path = os.path.join(dest_dir, "emails_list.json")

    print(f"Reading PDFs from:    {search_path}")
    print(f"Total PDF files found: {len(pdf_files)}")
    print(f"Output directory:     {dest_dir}")
    print("-" * 52)

    records = []
    all_unique_emails: Set[str] = set()

    for idx, pdf_path in enumerate(pdf_files, 1):
        filename = os.path.basename(pdf_path)
        text = extract_first_page_text(pdf_path)
        emails = extract_emails_from_text(text)

        for e in emails:
            all_unique_emails.add(e.lower())

        status = "SUCCESS" if len(emails) > 0 else "NOT_FOUND"
        
        records.append({
            "File_Name": filename,
            "Status": status,
            "Email_Count": len(emails),
            "Emails": "; ".join(emails),
        })
        
        print(f"[{idx}/{len(pdf_files)}] {filename} -> {status} ({len(emails)} email(s))")

    df = pd.DataFrame(records)
    
    # 1. Export CSV
    df.to_csv(csv_path, index=False, encoding="utf-8-sig")

    # 2. Export XLSX (if supported by environment)
    try:
        df.to_excel(xlsx_path, index=False)
    except Exception:
        pass

    # 3. Export emails_list.json
    sorted_unique_emails = sorted(list(all_unique_emails))
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(sorted_unique_emails, f, ensure_ascii=False, indent=2)

    print("\n================ EXTRACTION SUMMARY ================")
    print(f"Total Processed:      {len(df)}")
    print(f"Emails Found:          {(df['Status'] == 'SUCCESS').sum()}")
    print(f"Emails Missing:        {(df['Status'] == 'NOT_FOUND').sum()}")
    print(f"Total Unique Emails:   {len(sorted_unique_emails)}")
    print(f"Output files generated in '{dest_dir}':")
    print(f"  - extracted_emails.csv")
    print(f"  - extracted_emails.xlsx")
    print(f"  - emails_list.json")
    print("====================================================")
    
    return df


if __name__ == "__main__":
    import sys
    # Usage:
    # python3 extract_paper_emails.py <pdf_dir_or_target_dir> [output_dir]
    pdf_dir = sys.argv[1] if len(sys.argv) > 1 else "./pdfs"
    out_dir = sys.argv[2] if len(sys.argv) > 2 else None
    
    # If the user passed just 1 path, e.g. python3 extract_paper_emails.py ../dataset/icse/2025
    # and it's not "./pdfs", use that path as both input/output folder
    if not out_dir and len(sys.argv) > 1:
        out_dir = sys.argv[1]

    process_pdf_folder(pdf_dir, out_dir)