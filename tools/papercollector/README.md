# Paper Collector & Dataset Merger

Tools for scraping academic paper metadata and artifact badges from the ACM Digital Library and consolidating dataset files.

---

## File Structure

* `getPapersWithArtifactBadge.js` - Browser developer console script (DevTools F12) for scraping paper proceedings on the ACM Digital Library (e.g. ICSE, FSE, ISSTA, ASE).
* `merge_papers.py` - Python script to merge and deduplicate individual `papers.json` files across conference folders into the consolidated dataset file `tools/dataset/papers.json`.

---

## Usage

### 1. Scraping Papers from ACM Digital Library

1. Open the conference proceedings page on ACM Digital Library (e.g., *Proceedings of the 47th International Conference on Software Engineering*).
2. Open the Browser Console (`F12` -> Console tab).
3. Open `getPapersWithArtifactBadge.js` and configure the constants at the top:
   ```javascript
   const CONFERENCE = 'ICSE'; // Conference name: 'ICSE', 'FSE', 'ISSTA', 'ASE'
   const YEAR = 2025;         // Publication year: 2021, 2022, 2023, 2024, 2025
   ```
4. Paste the script into the console and press `Enter`.
5. Copy the generated JSON array and save it into the respective dataset directory (e.g. `tools/dataset/icse/2025/papers.json`).

---

### 2. Merging and Consolidating the Dataset

To consolidate all `papers.json` files from all conference and year directories into a single deduplicated dataset:

```bash
cd tools/papercollector
python3 merge_papers.py
```

#### Additional Options

* **Filter specific conferences:**
  ```bash
  python3 merge_papers.py -c fse issta
  ```
* **Specify custom dataset and output paths:**
  ```bash
  python3 merge_papers.py -d /path/to/dataset -o /path/to/output.json
  ```
