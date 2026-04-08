# Mode: scan — Portal Scanner (Job Discovery)

Scans configured job portals, filters by title relevance, and adds new offers to the pipeline for later evaluation.

## Flags

- `scan` (default) — **Level 1 only**: `node scan-portals.mjs` (fast, cheap, ~50 companies via API)
- `scan --playwright` — adds Level 2 (Playwright for companies without APIs)
- `scan --websearch` — adds Level 3 (WebSearch discovery queries)
- `scan --full` — all 3 levels

**Default is API-only.** Level 2 and Level 3 are opt-in because they consume significant tokens and time.

## Level 1 Execution (default)

**ALWAYS use `node scan-portals.mjs`** for Level 1. This runs locally with zero LLM tokens:

```bash
node scan-portals.mjs              # TSV to stdout, appends scan-history.tsv
node scan-portals.mjs --write      # Also appends new entries to pipeline.md
node scan-portals.mjs --dry-run    # Preview only, no file writes
```

The script outputs a TSV table to stdout with columns: company, title, location, url, boost.
Status/errors go to stderr. Read the stdout output to analyze results and present the summary.

After running the script, review the TSV output and present the scan summary to the user.
Apply geo-filtering logic (see below) when presenting results.

## Level 2/3 Execution (subagent)

For `--playwright` or `--websearch`, run as a subagent:

```
Agent(
    subagent_type="general-purpose",
    prompt="[contents of this file + specific data]",
    run_in_background=True
)
```

## Configuration

Read `portals.yml` which contains:
- `search_queries`: WebSearch queries with `site:` filters per portal (broad discovery)
- `tracked_companies`: Specific companies with `careers_url` and/or `api:` for direct access
- `title_filter`: Positive/negative/seniority_boost keywords for title filtering

## SCAN PRIORITY: API > Playwright > WebSearch

If a company has an `api:` field, NEVER use Playwright for it.
Playwright is reserved for companies with custom career pages that have no API.

## Discovery Strategy (3 Levels)

### Level 1 — APIs (DEFAULT, parallel via WebFetch)

For each company in `tracked_companies` with an `api:` field and `enabled: true`:
  WebFetch the JSON endpoint -> extract title + URL + location.
  Run ALL API calls in parallel -- WebFetch doesn't share a browser.

This is the fastest and most reliable method. Returns structured JSON with clean data.

**Known API patterns:**
- **Greenhouse:** `https://boards-api.greenhouse.io/v1/boards/{slug}/jobs`
- **Ashby:** `https://api.ashbyhq.com/posting-api/job-board/{slug}` (POST)
- **Lever:** `https://api.lever.co/v0/postings/{slug}`

For each job, extract: `{title, url, company}` + `{location}` from the structured response (Greenhouse: `location.name`, Ashby: `location`, Lever: `categories.location`).

### Level 2 — Playwright (opt-in via `--playwright` or `--full`)

For companies in `tracked_companies` with `careers_url` but NO `api:` field, and `enabled: true`:
  `browser_navigate` -> `browser_snapshot` -> extract listings.
  Run sequentially (single browser instance).

**For each company:**
  a. `browser_navigate` to the `careers_url`
  b. `browser_snapshot` to read all job listings
  c. Navigate filters/departments if present
  d. Extract `{title, url, company}` + `{location, remote, salary}` if visible
  e. Navigate additional pages if paginated
  f. If `careers_url` fails, try `scan_query` as fallback and flag for URL update

### Level 3 — WebSearch (opt-in via `--websearch` or `--full`)

For each query in `search_queries` with `enabled: true`:
  WebSearch -> extract new companies and roles.
  Run ALL queries in parallel.

Purpose: discover companies NOT yet in `tracked_companies`. Results may be stale (Google indexing lag).

All levels are additive -- merge results and deduplicate.

## Workflow

1. **Read config**: `portals.yml`
2. **Read history**: `data/scan-history.tsv` -> URLs already seen
3. **Read dedup sources**: `data/applications.md` + `data/pipeline.md`

4. **Level 1 -- API scan** (always, parallel):
   For each company with `api:` field and `enabled: true`:
   a. WebFetch the API endpoint -> parse JSON
   b. Extract `{title, url, company, location}` per job
   c. Accumulate in candidate list

5. **Level 2 -- Playwright scan** (`--playwright` or `--full` only, sequential):
   For each company with `careers_url` but NO `api:` field, and `enabled: true`:
   a. `browser_navigate` to `careers_url`
   b. `browser_snapshot` to read listings
   c. Navigate filters/departments if present
   d. Extract `{title, url, company}` + `{location, remote, salary}` if visible
   e. Navigate additional pages if paginated
   f. Accumulate in candidate list (dedup with Level 1)
   g. If `careers_url` fails, try `scan_query` as fallback and flag for update

6. **Level 3 -- WebSearch scan** (`--websearch` or `--full` only, parallel):
   For each query in `search_queries` with `enabled: true`:
   a. Run WebSearch with the defined `query`
   b. Extract `{title, url, company}` from each result
   c. Accumulate in candidate list (dedup with Level 1+2)

7. **Filter by title** using `title_filter` from `portals.yml`:
   - At least 1 `positive` keyword must appear in the title (case-insensitive)
   - 0 `negative` keywords must appear
   - `seniority_boost` keywords add priority but are not required

8. **Deduplicate** against 3 sources:
   - `scan-history.tsv` -> exact URL already seen
   - `applications.md` -> company + normalized role already evaluated
   - `pipeline.md` -> exact URL already pending or processed

9. **For each new offer that passes filters**:
   a. Capture metadata if visible on the listing page (no extra fetch):
      - **Location / Remote tag**: "Remote", "Hybrid", "New York, NY", etc.
      - **Salary range**: some portals show ranges inline (Ashby, Greenhouse sometimes)
      If available without extra fetch, include them. Otherwise leave blank.
   b. Add to `pipeline.md` section "Pending":
      - With metadata: `- [ ] {url} | {company} | {title} | {location} | {remote} | {salary}`
      - Partial metadata: `- [ ] {url} | {company} | {title} | {location} | {remote}`
      - Without metadata: `- [ ] {url} | {company} | {title}`
   c. Log in `scan-history.tsv`: `{url}\t{date}\t{query_name}\t{title}\t{company}\t{location}\t{remote}\t{salary}\tadded`

   **Note:** Do not make extra fetches per listing just for metadata -- too slow. Only capture what's already visible on the listing page.

10. **Offers filtered by title**: log in `scan-history.tsv` with status `skipped_title`
11. **Duplicate offers**: log with status `skipped_dup`

## Title and Company Extraction from WebSearch Results

WebSearch results come as: `"Job Title @ Company"` or `"Job Title | Company"` or `"Job Title -- Company"`.

Extraction patterns by portal:
- **Ashby**: `"Senior AI PM (Remote) @ EverAI"` -> title: `Senior AI PM`, company: `EverAI`
- **Greenhouse**: `"AI Engineer at Anthropic"` -> title: `AI Engineer`, company: `Anthropic`
- **Lever**: `"Product Manager - AI @ Temporal"` -> title: `Product Manager - AI`, company: `Temporal`

Generic regex: `(.+?)(?:\s*[@|---]-]\s*|\s+at\s+)(.+?)$`

## Private URLs

If a non-public URL is found:
1. Save the JD in `jds/{company}-{role-slug}.md`
2. Add to pipeline.md as: `- [ ] local:jds/{company}-{role-slug}.md | {company} | {title}`

## Scan History

`data/scan-history.tsv` tracks ALL URLs seen:

```
url	first_seen	portal	title	company	location	remote	salary	status
https://...	2026-02-10	Ashby — AI PM	PM AI	Acme	NYC	Hybrid	$180-250K	added
https://...	2026-02-10	Greenhouse — SA	Junior Dev	BigCo	Austin	Onsite		skipped_title
https://...	2026-02-10	Ashby — AI PM	SA AI	OldCo	Remote	Remote		skipped_dup
```

**Backward compatible:** Old entries without location/remote/salary columns are valid. New entries should include them when available (empty string if unknown).

## Output Summary

```
Portal Scan -- {YYYY-MM-DD}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Queries executed: N
Offers found: N total
Filtered by title: N relevant
Duplicates: N (already evaluated or in pipeline)
New added to pipeline.md: N

  + {company} | {title} | {location_if_known} | {salary_if_known}
  ...

-> Run /career-ops pipeline to evaluate the new offers.
-> Tip: review the list before running pipeline -- manually discard any roles that don't interest you.
```

## careers_url Management

Every company in `tracked_companies` should have `careers_url` -- the direct URL to its job listings page. This avoids searching for it every time.

**Known patterns by platform:**
- **Ashby:** `https://jobs.ashbyhq.com/{slug}`
- **Greenhouse:** `https://job-boards.greenhouse.io/{slug}` or `https://job-boards.eu.greenhouse.io/{slug}`
- **Lever:** `https://jobs.lever.co/{slug}`
- **Custom:** The company's own URL (e.g., `https://openai.com/careers`)

**If `careers_url` doesn't exist** for a company:
1. Try the known platform pattern
2. If that fails, do a quick WebSearch: `"{company}" careers jobs`
3. Navigate with Playwright to confirm it works
4. **Save the found URL in portals.yml** for future scans

**If `careers_url` returns 404 or redirect:**
1. Flag in the output summary
2. Try scan_query as fallback
3. Mark for manual update

## portals.yml Maintenance

- **ALWAYS save `careers_url`** when adding a new company
- Add new queries as interesting portals or roles are discovered
- Disable queries with `enabled: false` if they generate too much noise
- Adjust filter keywords as target roles evolve
- Add companies to `tracked_companies` when you want to track them closely
- Verify `careers_url` periodically -- companies change ATS platforms
