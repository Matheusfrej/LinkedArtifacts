"""
Merge Conference Papers List
----------------------------
Finds all `papers.json` files across conference folders (e.g. `fse`, `icse`,
`issta`, etc. for each year), merges all paper entries into a single list with deduplication
(keyed by DOI / URL / Title), and exports the consolidated dataset to
`tools/dataset/papers.json`.

Usage:
    # Run using default settings (scans all conference subfolders -> dataset/papers.json):
    python3 merge_papers.py

    # Filter specific conferences:
    python3 merge_papers.py --conferences issta fse

    # Specify custom output path:
    python3 merge_papers.py --output custom_papers.json
"""

import os
import sys
import glob
import json
import argparse
from typing import List, Dict, Any, Tuple, Set


def get_conference_folders(dataset_dir: str, conferences: List[str] = None) -> List[str]:
    """
    Returns the list of conference directory paths to scan.
    If conferences is None or empty, dynamically discovers all non-hidden subdirectories
    in dataset_dir.
    """
    dataset_abs = os.path.abspath(dataset_dir)
    if conferences:
        return sorted([
            os.path.join(dataset_abs, conf)
            for conf in conferences
            if os.path.isdir(os.path.join(dataset_abs, conf))
        ])

    conf_dirs = []
    try:
        for entry in os.scandir(dataset_abs):
            if entry.is_dir() and not entry.name.startswith(".") and entry.name != "__pycache__":
                conf_dirs.append(entry.path)
    except Exception as e:
        print(f"  [Error] Failed scanning directory '{dataset_abs}': {e}")
    return sorted(conf_dirs)


def find_conference_paper_files(dataset_dir: str, conferences: List[str] = None) -> List[str]:
    """
    Finds all papers.json files inside conference directories (or all conference
    folders in dataset_dir if conferences is None).
    Excludes top-level papers.json in dataset_dir itself to prevent recursive self-merges.
    """
    paper_files = []
    conf_dirs = get_conference_folders(dataset_dir, conferences)

    for conf_path in conf_dirs:
        pattern = os.path.join(conf_path, "**", "papers.json")
        matched = glob.glob(pattern, recursive=True)
        paper_files.extend(matched)

    return sorted(paper_files)


def load_papers_from_file(file_path: str) -> List[Dict[str, Any]]:
    """Loads papers array from a JSON file."""
    if not os.path.isfile(file_path):
        return []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                return [p for p in data if isinstance(p, dict)]
    except Exception as e:
        print(f"  [Error] Failed reading '{file_path}': {e}")
    return []


def get_paper_dedup_key(paper: Dict[str, Any]) -> str:
    """Generates a normalized unique key for deduplicating papers."""
    doi = str(paper.get("doi", "")).strip().lower()
    if doi:
        return f"doi:{doi}"
    url = str(paper.get("url", "")).strip().lower()
    if url:
        return f"url:{url}"
    title = str(paper.get("title", "")).strip().lower()
    if title:
        return f"title:{title}"
    return json.dumps(paper, sort_keys=True)


def merge_and_deduplicate_papers(
    dataset_dir: str,
    conferences: List[str] = None
) -> Tuple[List[Dict[str, Any]], Dict[str, Dict[str, int]]]:
    """
    Finds all conference papers.json files, merges them, deduplicates by DOI/URL/Title,
    and returns the merged paper list along with per-file stats.
    """
    paper_files = find_conference_paper_files(dataset_dir, conferences)

    seen_keys: Set[str] = set()
    merged_papers: List[Dict[str, Any]] = []
    stats: Dict[str, Dict[str, int]] = {}

    for file_path in paper_files:
        rel_path = os.path.relpath(file_path, dataset_dir)
        papers = load_papers_from_file(file_path)

        before_count = len(merged_papers)
        for paper in papers:
            key = get_paper_dedup_key(paper)
            if key not in seen_keys:
                seen_keys.add(key)
                merged_papers.append(paper)

        new_unique_added = len(merged_papers) - before_count
        stats[rel_path] = {
            "total_in_file": len(papers),
            "new_unique_added": new_unique_added
        }

    return merged_papers, stats


def main():
    parser = argparse.ArgumentParser(
        description="Merge all papers.json from conference folders into a single deduplicated dataset."
    )
    current_dir = os.path.dirname(os.path.abspath(__file__))
    default_output = os.path.join(current_dir, "papers.json")

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
        default=None,
        help="List of conference folder names to search in (default: all conference folders in dataset directory)."
    )

    args = parser.parse_args()

    dataset_dir = os.path.abspath(args.dataset_dir)
    output_file = os.path.abspath(args.output)
    conf_dirs = get_conference_folders(dataset_dir, args.conferences)
    conf_names = [os.path.basename(p) for p in conf_dirs]
    conferences_display = ", ".join(conf_names) if conf_names else "None found"
    if args.conferences is None:
        conferences_display = f"All detected ({conferences_display})"

    print("==================================================")
    print("           MERGING CONFERENCE PAPERS              ")
    print("==================================================")
    print(f"Dataset directory : {dataset_dir}")
    print(f"Conferences       : {conferences_display}")
    print(f"Output file       : {output_file}\n")

    merged_papers, stats = merge_and_deduplicate_papers(dataset_dir, args.conferences)

    if not stats:
        print("[Warning] No conference 'papers.json' files found!")
        sys.exit(1)

    print("------------------ FILE BREAKDOWN -----------------")
    print(f"{'File Path':<35} | {'Papers in File':<15} | {'New Unique Added':<16}")
    print("-" * 72)
    total_raw_papers = 0
    for file_rel_path, data in stats.items():
        total_raw_papers += data["total_in_file"]
        print(f"{file_rel_path:<35} | {data['total_in_file']:<15} | {data['new_unique_added']:<16}")
    print("-" * 72)

    badged_count = sum(
        1 for p in merged_papers
        if isinstance(p.get("badges"), list) and len(p.get("badges")) > 0
    )

    print("\n-------------------- SUMMARY ---------------------")
    print(f"Total files processed      : {len(stats)}")
    print(f"Total raw papers processed : {total_raw_papers}")
    print(f"Total unique papers        : {len(merged_papers)}")
    print(f"Duplicates removed         : {total_raw_papers - len(merged_papers)}")
    print(f"Papers with artifact badge : {badged_count}")
    print("--------------------------------------------------")

    # Ensure parent directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(merged_papers, f, ensure_ascii=False, indent=4)

    print(f"\n✓ Successfully saved merged papers to:\n  -> {output_file}\n")


if __name__ == "__main__":
    main()

