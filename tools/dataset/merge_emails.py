"""
Merge Conference Emails List
----------------------------
Finds all `emails_list.json` files across conference folders (e.g. `fse` and `icse`
for each year), merges all unique email addresses without duplication, and exports
the consolidated list to a single JSON file in the dataset directory.

Usage:
    # Run using default settings (scans fse/ and icse/ subfolders -> dataset/emails_list.json):
    python3 merge_emails.py

    # Specify custom output path:
    python3 merge_emails.py --output custom_emails_list.json
"""

import os
import sys
import glob
import json
import argparse
from typing import List, Set, Dict, Tuple


def find_conference_email_files(dataset_dir: str, conferences: List[str] = None) -> List[str]:
    """
    Finds all emails_list.json files inside specified conference directories
    (or any year folder under dataset_dir if conferences is None).
    Excludes top-level emails_list.json in dataset_dir itself to prevent recursive self-merges.
    """
    if conferences is None:
        conferences = ["fse", "icse"]

    email_files = []
    dataset_abs = os.path.abspath(dataset_dir)

    for conf in conferences:
        conf_path = os.path.join(dataset_abs, conf)
        if not os.path.isdir(conf_path):
            continue
        pattern = os.path.join(conf_path, "**", "emails_list.json")
        matched = glob.glob(pattern, recursive=True)
        email_files.extend(matched)

    return sorted(email_files)


def load_emails_from_file(file_path: str) -> List[str]:
    """Loads emails from a JSON array file."""
    if not os.path.isfile(file_path):
        return []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                return [str(e).strip() for e in data if str(e).strip()]
    except Exception as e:
        print(f"  [Error] Failed reading '{file_path}': {e}")
    return []


def merge_and_deduplicate_emails(
    dataset_dir: str,
    conferences: List[str] = None
) -> Tuple[List[str], Dict[str, Dict[str, int]]]:
    """
    Finds all conference email files, collects emails, deduplicates them,
    and returns a sorted unique list along with per-file statistics.
    """
    email_files = find_conference_email_files(dataset_dir, conferences)
    
    unique_emails_set: Set[str] = set()
    stats: Dict[str, Dict[str, int]] = {}

    for file_path in email_files:
        rel_path = os.path.relpath(file_path, dataset_dir)
        emails = load_emails_from_file(file_path)
        
        before_count = len(unique_emails_set)
        # Add stripped lowercase/standardized emails
        for email in emails:
            # We preserve standard email formatting (trimmed, lowercased for deduplication)
            unique_emails_set.add(email.strip().lower())
        new_unique_added = len(unique_emails_set) - before_count

        stats[rel_path] = {
            "total_in_file": len(emails),
            "new_unique_added": new_unique_added
        }

    sorted_unique_emails = sorted(list(unique_emails_set))
    return sorted_unique_emails, stats


def main():
    parser = argparse.ArgumentParser(
        description="Merge all emails_list.json from conference folders into a single deduplicated list."
    )
    current_dir = os.path.dirname(os.path.abspath(__file__))
    default_output = os.path.join(current_dir, "emails_list.json")

    parser.add_argument(
        "--dataset-dir",
        default=current_dir,
        help="Root directory of the dataset containing conference folders (default: current script directory)."
    )
    parser.add_argument(
        "--output", "-o",
        default=default_output,
        help=f"Output path for merged JSON file (default: {default_output})."
    )
    parser.add_argument(
        "--conferences", "-c",
        nargs="+",
        default=["fse", "icse"],
        help="List of conference folder names to search in (default: ['fse', 'icse'])."
    )

    args = parser.parse_args()

    dataset_dir = os.path.abspath(args.dataset_dir)
    output_file = os.path.abspath(args.output)

    print("==================================================")
    print("           MERGING CONFERENCE EMAILS              ")
    print("==================================================")
    print(f"Dataset directory : {dataset_dir}")
    print(f"Conferences       : {', '.join(args.conferences)}")
    print(f"Output file       : {output_file}\n")

    merged_emails, stats = merge_and_deduplicate_emails(dataset_dir, args.conferences)

    if not stats:
        print("[Warning] No conference 'emails_list.json' files found!")
        sys.exit(1)

    print("------------------ FILE BREAKDOWN -----------------")
    print(f"{'File Path':<35} | {'Emails in File':<15} | {'New Unique Added':<16}")
    print("-" * 72)
    total_raw_emails = 0
    for file_rel_path, data in stats.items():
        total_raw_emails += data["total_in_file"]
        print(f"{file_rel_path:<35} | {data['total_in_file']:<15} | {data['new_unique_added']:<16}")
    print("-" * 72)

    print("\n-------------------- SUMMARY ---------------------")
    print(f"Total files processed      : {len(stats)}")
    print(f"Total raw emails processed : {total_raw_emails}")
    print(f"Total unique emails        : {len(merged_emails)}")
    print(f"Duplicates removed         : {total_raw_emails - len(merged_emails)}")
    print("--------------------------------------------------")

    # Ensure parent directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(merged_emails, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Successfully saved merged emails to:\n  -> {output_file}\n")


if __name__ == "__main__":
    main()
