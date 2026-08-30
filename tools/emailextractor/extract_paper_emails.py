"""
Academic Paper Email Extractor
--------------------------------
Reads PDF files across academic dataset folders (e.g. ICSE, FSE, ASE, ISSTA),
extracts text from the first page (where authors and emails reside),
applies robust Regular Expression (Regex) patterns — including grouped bracket formats like {author1, author2}@domain.edu —,
automatically associates each paper with metadata (Title, Conference, Year, Authors, DOI) from `papers.json` using
a multi-strategy cascading matcher (DOI/URL ID, normalized title, truncated prefix, and fuzzy matching),
and outputs comprehensive summary spreadsheets (CSV & XLSX) and structured JSON files.

Supports single-folder execution or batch recursive processing across all conferences and years.
"""

import os
import re
import glob
import json
import difflib
import unicodedata
import argparse
import pandas as pd
from typing import List, Set, Dict, Any, Tuple, Optional

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
IGNORED_DOMAINS = {"example.com", "domain.com", "email.com", "github.com", "zenodo.org", "doi.org", "acm.org"}


def clean_email(email_str: str) -> str:
    """Removes trailing and leading punctuation."""
    return email_str.strip().strip(".,;:<>(){}[]\"'")


def normalize_text(text: str) -> str:
    """
    Normalizes string by converting to lowercase, stripping accents (NFKD),
    removing non-alphanumeric characters, and collapsing whitespace.
    """
    if not text:
        return ""
    text = unicodedata.normalize('NFKD', str(text)).encode('ASCII', 'ignore').decode('utf-8')
    text = re.sub(r'[^a-zA-Z0-9]', ' ', text).lower()
    return ' '.join(text.split())


def extract_emails_from_text(text: str) -> List[str]:
    """Extracts standard and bracket-grouped emails from text."""
    if not text:
        return []

    found_emails: Set[str] = set()

    # Bracketed format: {user1, user2}@domain.com
    for match in BRACKETED_EMAIL_PATTERN.finditer(text):
        users_raw, domain = match.groups()
        normalized_domain = domain.strip().lower()
        if normalized_domain in IGNORED_DOMAINS:
            continue
        users = [u.strip() for u in users_raw.replace(",", " ").split() if u.strip()]
        for u in users:
            clean_u = clean_email(u)
            if clean_u and not clean_u.startswith("@"):
                found_emails.add(f"{clean_u}@{normalized_domain}")

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


class PaperIndex:
    """
    Indexes papers metadata from papers.json and performs cascading matching
    against PDF filenames (handling DOI/URL suffixes, normalized titles,
    truncated prefixes, and fuzzy matching).
    """
    def __init__(self, papers: List[Dict[str, Any]]):
        self.papers = papers
        self.doi_map: Dict[str, Dict[str, Any]] = {}
        self.url_map: Dict[str, Dict[str, Any]] = {}
        self.exact_title_map: Dict[str, Dict[str, Any]] = {}
        self.normalized_papers: List[Tuple[str, Dict[str, Any]]] = []

        for p in papers:
            # 1. Index DOI
            doi = str(p.get("doi", "")).strip().lower()
            if doi:
                self.doi_map[doi] = p
                parts = doi.replace("\\", "/").split("/")
                if len(parts) > 1 and parts[-1]:
                    self.doi_map[parts[-1]] = p
                if len(parts) > 2 and f"{parts[-2]}/{parts[-1]}":
                    self.doi_map[f"{parts[-2]}/{parts[-1]}"] = p

            # 2. Index URL
            url = str(p.get("url", "")).strip().lower()
            if url:
                self.url_map[url] = p
                parts = url.replace("\\", "/").split("/")
                if len(parts) > 1 and parts[-1]:
                    self.url_map[parts[-1]] = p
                if len(parts) > 2 and f"{parts[-2]}/{parts[-1]}":
                    self.url_map[f"{parts[-2]}/{parts[-1]}"] = p

            # 3. Index Title
            title = str(p.get("title", "")).strip()
            if title:
                norm_title = normalize_text(title)
                self.exact_title_map[norm_title] = p
                self.normalized_papers.append((norm_title, p))

    def match(self, filename: str) -> Tuple[Optional[Dict[str, Any]], str]:
        """
        Attempts to match a PDF filename against indexed papers using cascading strategy:
        Returns: (matched_paper_dict_or_None, match_type_str)
        """
        stem = os.path.splitext(os.path.basename(filename))[0].strip()
        stem_lower = stem.lower()
        norm_stem = normalize_text(stem)

        if not stem:
            return None, "UNMATCHED"

        # Step 1: Exact DOI or URL Key/Suffix Match
        if stem_lower in self.doi_map:
            return self.doi_map[stem_lower], "DOI_EXACT"
        if stem_lower in self.url_map:
            return self.url_map[stem_lower], "URL_EXACT"

        # Step 1b: DOI or URL Substring Check
        for p in self.papers:
            doi = str(p.get("doi", "")).lower()
            url = str(p.get("url", "")).lower()
            if stem_lower and (doi.endswith(stem_lower) or f"/{stem_lower}" in doi):
                return p, "DOI_SUBSTRING"
            if stem_lower and (url.endswith(stem_lower) or f"/{stem_lower}" in url):
                return p, "URL_SUBSTRING"

        # Step 2: Exact Normalized Title Match
        if norm_stem and norm_stem in self.exact_title_map:
            return self.exact_title_map[norm_stem], "TITLE_EXACT"

        # Step 3: Prefix Match (Handles filenames truncated by OS length limits)
        if len(norm_stem) >= 20:
            for norm_title, p in self.normalized_papers:
                if norm_title.startswith(norm_stem) or norm_stem.startswith(norm_title):
                    return p, "TITLE_PREFIX"

        # Step 4: Fuzzy Matching (SequenceMatcher ratio >= 0.88)
        if len(norm_stem) >= 15:
            best_ratio = 0.0
            best_match = None
            for norm_title, p in self.normalized_papers:
                ratio = difflib.SequenceMatcher(None, norm_stem, norm_title).ratio()
                if ratio > best_ratio:
                    best_ratio = ratio
                    best_match = p

            if best_match and best_ratio >= 0.88:
                return best_match, f"TITLE_FUZZY_{int(best_ratio*100)}%"

        return None, "UNMATCHED"


def find_papers_json(folder_path: str, custom_papers_path: Optional[str] = None) -> Optional[str]:
    """
    Locates the most appropriate papers.json file:
    1. Custom path if provided.
    2. Local papers.json in folder_path.
    3. Parent folder papers.json (e.g. if folder_path is 'pdfs/').
    4. Consolidated dataset/papers.json upwards in the repository tree.
    """
    if custom_papers_path and os.path.isfile(custom_papers_path):
        return os.path.abspath(custom_papers_path)

    folder_abs = os.path.abspath(folder_path)

    # 1. Check folder directly
    cand_local = os.path.join(folder_abs, "papers.json")
    if os.path.isfile(cand_local):
        return cand_local

    # 2. Check parent folder (e.g. if pointing to dataset/fse/2025/pdfs)
    parent = os.path.dirname(folder_abs)
    cand_parent = os.path.join(parent, "papers.json")
    if os.path.isfile(cand_parent):
        return cand_parent

    # 3. Check for workspace dataset/papers.json
    curr = folder_abs
    for _ in range(5):
        cand_ds = os.path.join(curr, "tools", "dataset", "papers.json")
        if os.path.isfile(cand_ds):
            return cand_ds
        cand_ds2 = os.path.join(curr, "dataset", "papers.json")
        if os.path.isfile(cand_ds2):
            return cand_ds2
        cand_ds3 = os.path.join(curr, "papers.json")
        if os.path.isfile(cand_ds3):
            return cand_ds3
        parent_dir = os.path.dirname(curr)
        if parent_dir == curr:
            break
        curr = parent_dir

    return None


def load_papers_json(papers_json_path: str) -> List[Dict[str, Any]]:
    """Loads papers from a JSON file."""
    if not papers_json_path or not os.path.isfile(papers_json_path):
        return []
    try:
        with open(papers_json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                return [p for p in data if isinstance(p, dict)]
    except Exception as e:
        print(f"[Warning] Failed loading papers.json from '{papers_json_path}': {e}")
    return []


def discover_leaf_pdf_folders(root_dir: str, conferences: Optional[List[str]] = None) -> List[str]:
    """
    Recursively scans root_dir for conference/year folders containing PDFs.
    Returns a sorted list of unique directory paths that contain papers.
    """
    root_abs = os.path.abspath(root_dir)
    discovered_folders: Set[str] = set()

    for current_root, dirs, files in os.walk(root_abs):
        if any(part.startswith(".") or part == "__pycache__" for part in current_root.split(os.sep)):
            continue

        pdf_files = [f for f in files if f.lower().endswith(".pdf")]
        if pdf_files:
            # If current_root is named 'pdfs', the logical folder is its parent (e.g. dataset/icse/2021)
            if os.path.basename(current_root).lower() == "pdfs":
                logical_folder = os.path.dirname(current_root)
            else:
                logical_folder = current_root

            # Check if conference filter applies
            if conferences:
                rel_path = os.path.relpath(logical_folder, root_abs)
                parts = rel_path.split(os.sep)
                conf_name = parts[0].lower() if parts else ""
                if conf_name not in [c.lower() for c in conferences]:
                    continue

            discovered_folders.add(logical_folder)

    return sorted(list(discovered_folders))


def process_pdf_folder(
    folder_path: str,
    output_dir: Optional[str] = None,
    papers_json_path: Optional[str] = None,
    quiet: bool = False
) -> Tuple[pd.DataFrame, List[Dict[str, Any]], Set[str]]:
    """
    Processes all PDFs in a single conference/year folder and generates:
      1. extracted_emails.csv
      2. extracted_emails.xlsx
      3. emails_list.json (unique deduplicated list of raw emails)
      4. emails_with_papers.json (list associating each email with its paper metadata)
    all saved directly in output_dir (or folder_path by default).
    Returns (DataFrame, emails_with_papers_list, unique_emails_set).
    """
    search_path = folder_path
    pdf_files = glob.glob(os.path.join(search_path, "*.pdf"))
    if not pdf_files and os.path.isdir(os.path.join(folder_path, "pdfs")):
        search_path = os.path.join(folder_path, "pdfs")
        pdf_files = glob.glob(os.path.join(search_path, "*.pdf"))

    if not pdf_files:
        if not quiet:
            print(f"No PDF files found in: {folder_path} (or {os.path.join(folder_path, 'pdfs')})")
        return pd.DataFrame(), [], set()

    dest_dir = output_dir if output_dir else folder_path
    os.makedirs(dest_dir, exist_ok=True)

    csv_path = os.path.join(dest_dir, "extracted_emails.csv")
    xlsx_path = os.path.join(dest_dir, "extracted_emails.xlsx")
    json_path = os.path.join(dest_dir, "emails_list.json")
    detailed_json_path = os.path.join(dest_dir, "emails_with_papers.json")

    # Resolve and load papers.json metadata
    resolved_papers_path = find_papers_json(folder_path, papers_json_path)
    papers_data = load_papers_json(resolved_papers_path) if resolved_papers_path else []
    paper_index = PaperIndex(papers_data)

    if not quiet:
        print(f"Reading PDFs from:       {search_path}")
        print(f"Total PDF files found:    {len(pdf_files)}")
        print(f"Papers metadata source:  {resolved_papers_path if resolved_papers_path else 'None (no matching)'}")
        print(f"Output directory:        {dest_dir}")
        print("-" * 65)

    records = []
    all_unique_emails: Set[str] = set()
    emails_with_papers_list: List[Dict[str, Any]] = []
    matched_papers_count = 0

    for idx, pdf_path in enumerate(sorted(pdf_files), 1):
        filename = os.path.basename(pdf_path)
        text = extract_first_page_text(pdf_path)
        emails = extract_emails_from_text(text)

        matched_paper, match_type = paper_index.match(filename)
        if matched_paper:
            matched_papers_count += 1
            paper_title = matched_paper.get("title", "")
            conference = matched_paper.get("conference", "")
            year = matched_paper.get("year", "")
            doi = matched_paper.get("doi", "")
            authors = matched_paper.get("authors", [])
            authors_str = "; ".join(authors) if isinstance(authors, list) else str(authors)
        else:
            paper_title = ""
            conference = ""
            year = ""
            doi = ""
            authors = []
            authors_str = ""

        for e in emails:
            e_lower = e.lower()
            all_unique_emails.add(e_lower)
            emails_with_papers_list.append({
                "email": e_lower,
                "paper_title": paper_title,
                "conference": conference,
                "year": year,
                "doi": doi,
                "authors": authors,
                "file_name": filename,
                "match_type": match_type
            })

        status = "SUCCESS" if len(emails) > 0 else "NOT_FOUND"

        records.append({
            "File_Name": filename,
            "Paper_Title": paper_title,
            "Conference": conference,
            "Year": year,
            "DOI": doi,
            "Authors": authors_str,
            "Status": status,
            "Email_Count": len(emails),
            "Emails": "; ".join(emails),
            "Match_Type": match_type
        })

        if not quiet:
            match_label = f"[{match_type}]" if matched_paper else "[NO_MATCH]"
            print(f"[{idx}/{len(pdf_files)}] {filename} -> {status} ({len(emails)} email(s)) {match_label}")

    df = pd.DataFrame(records)

    # 1. Export CSV
    df.to_csv(csv_path, index=False, encoding="utf-8-sig")

    # 2. Export XLSX
    try:
        df.to_excel(xlsx_path, index=False)
    except Exception:
        pass

    # 3. Export emails_list.json
    sorted_unique_emails = sorted(list(all_unique_emails))
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(sorted_unique_emails, f, ensure_ascii=False, indent=2)

    # 4. Export emails_with_papers.json
    with open(detailed_json_path, "w", encoding="utf-8") as f:
        json.dump(emails_with_papers_list, f, ensure_ascii=False, indent=2)

    if not quiet:
        print("\n=================== EXTRACTION SUMMARY ===================")
        print(f"Total Processed:         {len(df)}")
        print(f"Emails Found:             {(df['Status'] == 'SUCCESS').sum()}")
        print(f"Emails Missing:           {(df['Status'] == 'NOT_FOUND').sum()}")
        print(f"Papers Matched to Meta:   {matched_papers_count}/{len(df)} ({matched_papers_count/len(df)*100:.1f}%)" if len(df) > 0 else "0")
        print(f"Total Unique Emails:      {len(sorted_unique_emails)}")
        print(f"Output files generated in '{dest_dir}':")
        print(f"  - extracted_emails.csv")
        print(f"  - extracted_emails.xlsx")
        print(f"  - emails_list.json")
        print(f"  - emails_with_papers.json")
        print("==========================================================")

    return df, emails_with_papers_list, all_unique_emails


def process_dataset_batch(
    dataset_root: str,
    output_dir: Optional[str] = None,
    conferences: Optional[List[str]] = None,
    papers_json_path: Optional[str] = None
) -> None:
    """
    Discovers all conference/year folders with PDFs inside dataset_root,
    processes each one independently (generating per-folder reports),
    and then consolidates and deduplicates all results into global dataset-level files.
    """
    root_abs = os.path.abspath(dataset_root)
    dest_dir = os.path.abspath(output_dir) if output_dir else root_abs
    os.makedirs(dest_dir, exist_ok=True)

    folder_list = discover_leaf_pdf_folders(root_abs, conferences)

    if not folder_list:
        print(f"[Warning] No conference folders with PDF files found inside '{root_abs}'.")
        return

    print("==========================================================")
    print("       BATCH ACADEMIC EMAIL EXTRACTION & MATCHING         ")
    print("==========================================================")
    print(f"Dataset root directory : {root_abs}")
    print(f"Found folders to scan  : {len(folder_list)}")
    if conferences:
        print(f"Conference filter      : {', '.join(conferences)}")
    print(f"Consolidated output    : {dest_dir}\n")

    all_dfs = []
    global_unique_emails: Set[str] = set()
    global_emails_with_papers: List[Dict[str, Any]] = []
    folder_stats = []

    for idx, folder in enumerate(folder_list, 1):
        rel_name = os.path.relpath(folder, root_abs)
        print(f"\n[{idx}/{len(folder_list)}] >>> Processing: {rel_name}")
        print("-" * 65)

        df, emails_with_papers, unique_emails = process_pdf_folder(
            folder_path=folder,
            output_dir=folder,
            papers_json_path=papers_json_path,
            quiet=False
        )

        if not df.empty:
            all_dfs.append(df)
            global_unique_emails.update(unique_emails)
            global_emails_with_papers.extend(emails_with_papers)

            success_count = (df['Status'] == 'SUCCESS').sum()
            matched_count = (df['Paper_Title'] != "").sum()
            folder_stats.append({
                "folder": rel_name,
                "total_papers": len(df),
                "with_emails": success_count,
                "matched_meta": matched_count,
                "unique_emails": len(unique_emails)
            })

    if not all_dfs:
        print("\nNo data processed.")
        return

    # Consolidate global dataset files
    global_df = pd.concat(all_dfs, ignore_index=True)
    global_csv_path = os.path.join(dest_dir, "extracted_emails.csv")
    global_xlsx_path = os.path.join(dest_dir, "extracted_emails.xlsx")
    global_json_path = os.path.join(dest_dir, "emails_list.json")
    global_detailed_json_path = os.path.join(dest_dir, "emails_with_papers.json")

    # Export consolidated CSV & XLSX
    global_df.to_csv(global_csv_path, index=False, encoding="utf-8-sig")
    try:
        global_df.to_excel(global_xlsx_path, index=False)
    except Exception:
        pass

    # Export consolidated emails_list.json
    sorted_global_emails = sorted(list(global_unique_emails))
    with open(global_json_path, "w", encoding="utf-8") as f:
        json.dump(sorted_global_emails, f, ensure_ascii=False, indent=2)

    # Deduplicate emails_with_papers by (email, doi or paper_title)
    seen_pairs = set()
    dedup_emails_with_papers = []
    for item in global_emails_with_papers:
        key = (item["email"], item["doi"] or item["paper_title"])
        if key not in seen_pairs:
            seen_pairs.add(key)
            dedup_emails_with_papers.append(item)

    with open(global_detailed_json_path, "w", encoding="utf-8") as f:
        json.dump(dedup_emails_with_papers, f, ensure_ascii=False, indent=2)

    # Print Final Consolidated Report
    total_papers = len(global_df)
    total_with_emails = (global_df['Status'] == 'SUCCESS').sum()
    total_matched = (global_df['Paper_Title'] != "").sum()

    print("\n\n==========================================================")
    print("             CONSOLIDATED DATASET SUMMARY                 ")
    print("==========================================================")
    print(f"{'Folder':<22} | {'Papers':<8} | {'w/ Email':<9} | {'Matched':<9} | {'Emails':<8}")
    print("-" * 65)
    for s in folder_stats:
        print(f"{s['folder']:<22} | {s['total_papers']:<8} | {s['with_emails']:<9} | {s['matched_meta']:<9} | {s['unique_emails']:<8}")
    print("-" * 65)
    print(f"{'TOTAL':<22} | {total_papers:<8} | {total_with_emails:<9} | {total_matched:<9} | {len(sorted_global_emails):<8}")
    print("==========================================================")
    print(f"Total Papers Processed   : {total_papers}")
    print(f"Papers with Emails Found : {total_with_emails} ({total_with_emails/total_papers*100:.1f}%)")
    print(f"Papers Matched to Meta   : {total_matched} ({total_matched/total_papers*100:.1f}%)")
    print(f"Total Unique Emails      : {len(sorted_global_emails)}")
    print(f"\nConsolidated Output Files in '{dest_dir}':")
    print(f"  - extracted_emails.csv")
    print(f"  - extracted_emails.xlsx")
    print(f"  - emails_list.json")
    print(f"  - emails_with_papers.json")
    print("==========================================================\n")


def main():
    parser = argparse.ArgumentParser(
        description="Extract emails from academic PDFs and correlate with papers.json metadata (single folder or batch dataset)."
    )
    parser.add_argument(
        "target_dir",
        nargs="?",
        default="./pdfs",
        help="Directory containing PDF files or dataset root folder containing conference subfolders (default: './pdfs')."
    )
    parser.add_argument(
        "output_dir",
        nargs="?",
        default=None,
        help="Output directory to save summary files (default: same as target_dir)."
    )
    parser.add_argument(
        "--all", "-a",
        action="store_true",
        help="Force batch recursive scan of all subfolders inside target_dir."
    )
    parser.add_argument(
        "--conferences", "-c",
        nargs="+",
        default=None,
        help="Filter specific conferences during batch processing (e.g. -c icse fse issta)."
    )
    parser.add_argument(
        "--papers", "-p",
        dest="papers_json",
        default=None,
        help="Custom path to papers.json metadata file (default: auto-detected in target or dataset directories)."
    )

    args = parser.parse_args()

    target_dir = args.target_dir
    output_dir = args.output_dir if args.output_dir else target_dir

    # Check if target_dir has PDFs directly or is a multi-conference dataset container
    leaf_folders = discover_leaf_pdf_folders(target_dir, args.conferences)

    is_batch_mode = args.all or (len(leaf_folders) > 1 and not glob.glob(os.path.join(target_dir, "*.pdf")))

    if is_batch_mode:
        process_dataset_batch(
            dataset_root=target_dir,
            output_dir=output_dir,
            conferences=args.conferences,
            papers_json_path=args.papers_json
        )
    else:
        process_pdf_folder(
            folder_path=target_dir,
            output_dir=output_dir,
            papers_json_path=args.papers_json,
            quiet=False
        )


if __name__ == "__main__":
    main()