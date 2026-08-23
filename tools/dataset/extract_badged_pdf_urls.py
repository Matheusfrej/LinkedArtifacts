"""
Extract Badged PDF URLs
-----------------------
Extracts direct PDF download URLs for papers with artifact badges from papers.json.

Usage:
    # Process a specific year folder (e.g. 2025):
    python3 extract_badged_pdf_urls.py 2025

    # Process all year subdirectories under icse and fse:
    python3 extract_badged_pdf_urls.py --all

    # Explicit input and output files:
    python3 extract_badged_pdf_urls.py 2025/papers.json 2025/badged_pdf_urls.json
"""

import json
import sys
import os
from typing import List
import glob


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


def process_directory(dir_path: str) -> None:
    """Processes a year directory containing papers.json."""
    input_file = os.path.join(dir_path, "papers.json")
    output_file = os.path.join(dir_path, "badged_pdf_urls.json")
    print(f"Processing folder: '{dir_path}'...")
    extract_badged_pdf_urls_from_file(input_file, output_file)


def process_all_year_folders() -> None:
    """Finds and processes every folder containing papers.json under dataset."""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    subdirs = sorted(
        os.path.dirname(input_file)
        for input_file in glob.glob(
            os.path.join(current_dir, "**", "papers.json"),
            recursive=True
        )
    )

    if not subdirs:
        print("No year subdirectories containing 'papers.json' found.")
        return

    print(f"Found {len(subdirs)} dataset folder(s) to process:\n")
    for d in subdirs:
        process_directory(d)
        print()


def main():
    if len(sys.argv) == 1:
        # Default: if papers.json is in current dir, process it; otherwise process all year folders
        if os.path.exists("papers.json"):
            extract_badged_pdf_urls_from_file("papers.json", "badged_pdf_urls.json")
        else:
            process_all_year_folders()
        return

    arg1 = sys.argv[1]

    if arg1 in ("--all", "-a", "all"):
        process_all_year_folders()
        return

    if os.path.isdir(arg1):
        process_directory(arg1)
        return

    # If file paths are provided explicitly
    input_path = arg1
    output_path = sys.argv[2] if len(sys.argv) > 2 else "badged_pdf_urls.json"
    extract_badged_pdf_urls_from_file(input_path, output_path)


if __name__ == "__main__":
    main()