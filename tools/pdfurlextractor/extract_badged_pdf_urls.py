"""
Extract Badged PDF URLs
-----------------------
Extracts direct PDF download URLs for papers with artifact badges from papers.json
files across conference year directories or a single dataset file.

Usage:
    # Process all conference year folders across dataset:
    python3 extract_badged_pdf_urls.py --all

    # Process a specific year folder (e.g. ../dataset/fse/2025):
    python3 extract_badged_pdf_urls.py ../dataset/fse/2025

    # Explicit input and output files:
    python3 extract_badged_pdf_urls.py path/to/papers.json path/to/badged_pdf_urls.json
"""

import os
import sys
import glob
import json
import argparse
from typing import List, Dict, Any, Optional


def get_default_dataset_dir() -> str:
    """Returns default dataset directory path relative to this script."""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    candidate = os.path.abspath(os.path.join(current_dir, "..", "dataset"))
    if os.path.isdir(candidate):
        return candidate
    return os.path.abspath("./dataset")


def extract_badged_pdf_urls_from_file(
    input_file: str,
    output_file: str
) -> int:
    """
    Reads a JSON file containing a list of paper objects and extracts
    the direct PDF download URLs for all papers that have artifact badges.
    Returns the count of extracted URLs.
    """
    if not os.path.exists(input_file):
        print(f"  [Error] Input file '{input_file}' not found.")
        return 0

    if os.path.getsize(input_file) == 0:
        print(f"  [Skip] '{input_file}' is empty (0 bytes).")
        return 0

    try:
        with open(input_file, "r", encoding="utf-8") as f:
            papers = json.load(f)
    except Exception as e:
        print(f"  [Error] Failed reading '{input_file}': {e}")
        return 0

    if not isinstance(papers, list):
        print(f"  [Error] JSON in '{input_file}' must be an array of objects.")
        return 0

    badged_pdf_urls: List[str] = []

    for paper in papers:
        url = paper.get("url")
        if not url:
            continue

        badges = paper.get("badges")

        if isinstance(badges, list) and len(badges) > 0:
            pdf_url = url.replace("/doi/", "/doi/pdf/")
            badged_pdf_urls.append(pdf_url)

    try:
        os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(badged_pdf_urls, f, ensure_ascii=False, indent=4)
        print(f"  ✓ Saved '{output_file}' ({len(badged_pdf_urls)} PDF URL(s)).")
        return len(badged_pdf_urls)
    except Exception as e:
        print(f"  [Error] Failed saving '{output_file}': {e}")
        return 0


def process_directory(dir_path: str) -> int:
    """Processes a year directory containing papers.json."""
    input_file = os.path.join(dir_path, "papers.json")
    output_file = os.path.join(dir_path, "badged_pdf_urls.json")
    print(f"Processing folder: '{dir_path}'...")
    return extract_badged_pdf_urls_from_file(input_file, output_file)


def process_all_year_folders(dataset_root: str) -> None:
    """Finds and processes every folder containing papers.json under dataset."""
    root_abs = os.path.abspath(dataset_root)
    all_paper_files = sorted(
        glob.glob(os.path.join(root_abs, "**", "papers.json"), recursive=True)
    )

    # Exclude root papers.json from per-folder iteration if present
    subdirs = sorted(list(set(
        os.path.dirname(f)
        for f in all_paper_files
        if os.path.dirname(f) != root_abs
    )))

    if not subdirs:
        print(f"No conference subdirectories containing 'papers.json' found under '{root_abs}'.")
        return

    print(f"Found {len(subdirs)} dataset folder(s) to process in '{root_abs}':\n")
    total_extracted = 0
    for d in subdirs:
        count = process_directory(d)
        total_extracted += count
        print()

    # Also generate consolidated badged_pdf_urls.json at dataset root if root papers.json exists
    root_papers = os.path.join(root_abs, "papers.json")
    if os.path.isfile(root_papers):
        root_out = os.path.join(root_abs, "badged_pdf_urls.json")
        print("Generating consolidated root 'badged_pdf_urls.json'...")
        extract_badged_pdf_urls_from_file(root_papers, root_out)

    print("==========================================================")
    print(f"Total Badged PDF URLs Extracted across folders: {total_extracted}")
    print("==========================================================")


def main():
    default_dataset = get_default_dataset_dir()

    if len(sys.argv) == 1:
        # Default: process all year folders under default dataset directory
        process_all_year_folders(default_dataset)
        return

    arg1 = sys.argv[1]

    if arg1 in ("--all", "-a", "all"):
        target = sys.argv[2] if len(sys.argv) > 2 else default_dataset
        process_all_year_folders(target)
        return

    if os.path.isdir(arg1):
        # If folder contains subfolders with papers.json, batch process; otherwise process single dir
        sub_papers = glob.glob(os.path.join(arg1, "**", "papers.json"), recursive=True)
        if len(sub_papers) > 1:
            process_all_year_folders(arg1)
        else:
            process_directory(arg1)
        return

    # If explicit file paths are provided
    input_path = arg1
    output_path = sys.argv[2] if len(sys.argv) > 2 else "badged_pdf_urls.json"
    extract_badged_pdf_urls_from_file(input_path, output_path)


if __name__ == "__main__":
    main()
