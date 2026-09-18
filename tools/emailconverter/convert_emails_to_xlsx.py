#!/usr/bin/env python3
"""
Convert emails_with_papers.json to an Excel (.xlsx) file.

By default, duplicate email occurrences are removed, retaining only the first
encountered paper for each unique email address. This can be toggled using
the --keep-duplicates (or --no-dedup) flag.
"""

import argparse
import json
import os
from pathlib import Path
import pandas as pd


def convert_json_to_xlsx(
    input_path: str,
    output_path: str | None = None,
    deduplicate: bool = True,
) -> str:
    input_file = Path(input_path).resolve()
    if not input_file.exists():
        raise FileNotFoundError(f"Input file not found: {input_file}")

    if output_path is None:
        output_file = input_file.with_suffix(".xlsx")
    else:
        output_file = Path(output_path).resolve()

    print(f"Reading JSON from: {input_file}")
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Format list fields (e.g. authors) cleanly as semicolon-separated strings
    for row in data:
        if isinstance(row.get("authors"), list):
            row["authors"] = "; ".join(row["authors"])

    df = pd.DataFrame(data)

    initial_count = len(df)
    if deduplicate and "email" in df.columns:
        df = df.drop_duplicates(subset=["email"], keep="first")
        removed_count = initial_count - len(df)
        if removed_count > 0:
            print(f"Deduplication enabled: removed {removed_count} duplicate email(s). Retained {len(df)} unique records.")
        else:
            print(f"Deduplication enabled: all {len(df)} emails are already unique.")
    else:
        print(f"Deduplication disabled: preserving all {len(df)} records.")

    # Desired column order
    preferred_order = [
        "email",
        "paper_title",
        "conference",
        "year",
        "doi",
        "authors",
        "file_name",
        "match_type",
    ]
    cols = [c for c in preferred_order if c in df.columns] + [
        c for c in df.columns if c not in preferred_order
    ]
    df = df[cols]

    # Write to Excel using openpyxl
    print(f"Writing {len(df)} records to: {output_file}")
    with pd.ExcelWriter(output_file, engine="openpyxl") as writer:
        sheet_name = "Emails With Papers"
        df.to_excel(writer, index=False, sheet_name=sheet_name)

        # Auto-adjust column widths for better readability (capped at 60)
        worksheet = writer.sheets[sheet_name]
        for col in worksheet.columns:
            max_len = max(len(str(cell.value or "")) for cell in col)
            col_letter = col[0].column_letter
            worksheet.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 60)

    print(f"Done! Excel file generated: {output_file}")
    return str(output_file)


def main():
    # Default input file: tools/dataset/emails_with_papers.json
    default_input = Path(__file__).resolve().parent.parent / "dataset" / "emails_with_papers.json"

    parser = argparse.ArgumentParser(
        description="Convert emails_with_papers.json to an Excel spreadsheet (.xlsx)."
    )
    parser.add_argument(
        "-i",
        "--input",
        default=str(default_input),
        help=f"Path to input JSON file (default: {default_input})",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=None,
        help="Path to output XLSX file (default: same folder and base name as input with .xlsx extension)",
    )
    parser.add_argument(
        "--keep-duplicates",
        "--allow-duplicates",
        "--no-dedup",
        dest="deduplicate",
        action="store_false",
        help="Disable deduplication and keep all occurrences of duplicate emails. By default, duplicate emails are removed, keeping only the first paper.",
    )

    args = parser.parse_args()
    convert_json_to_xlsx(
        input_path=args.input,
        output_path=args.output,
        deduplicate=args.deduplicate,
    )


if __name__ == "__main__":
    main()

