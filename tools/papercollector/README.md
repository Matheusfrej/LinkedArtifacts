# Paper Collector & Dataset Merger

Tools for scraping academic paper metadata and artifact badges from the ACM Digital Library and consolidating dataset files.

---

## File Structure

* `getPapersWithArtifactBadge.js` - Browser developer console script (DevTools F12) for scraping paper proceedings on the ACM Digital Library (e.g. ICSE, FSE, ISSTA, ASE).
* `merge_papers.py` - Python script to merge and deduplicate individual `papers.json` files across conference folders into the consolidated dataset file `tools/dataset/papers.json`.

---

## Usage

### 1. Scraping Papers from ACM Digital Library

1. Open the conference proceedings table of contents on the ACM Digital Library.
2. Navigate to the specific proceedings edition, track, or publication year (e.g., `https://dl.acm.org/doi/proceedings/10.5555/3767285`).
3. Ensure all paper entries are fully expanded and loaded in the DOM (e.g., expand collapsed session sections, scroll down, or click "Load More" / adjust pagination to display all items). The script queries `.issue-item-container` elements currently rendered in the page HTML.
4. **Artifact Badges Note:** To extract artifact badge metadata, badges must be visually displayed on the proceedings page. Some ACM DL volumes or tracks do not render badge icons in the table of contents; for those editions, badge fields will automatically default to empty/false.
5. Open the Browser Developer Tools Console (`F12` or `Ctrl+Shift+I` / `Cmd+Option+I` -> **Console** tab).
6. In `getPapersWithArtifactBadge.js`, update the constants at the top:
   ```javascript
   const CONFERENCE = 'ICSE'; // Conference name: 'ICSE', 'FSE', 'ISSTA', 'ASE'
   const YEAR = 2025;         // Publication year: 2021, 2022, 2023, 2024, 2025
   ```
7. Paste the script into the console and press `Enter`.
8. Copy the generated JSON array and save it into the respective dataset directory (e.g. `tools/dataset/icse/2025/papers.json`).

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
