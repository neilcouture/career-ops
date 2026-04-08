# Mode: pipeline — URL Inbox (Second Brain)

Processes job offer URLs accumulated in `data/pipeline.md`. The user adds URLs anytime, then runs `/career-ops pipeline` to process them all.

## Date Filtering (default: today only)

Sections in `## Pending` have date headers like `### ... (YYYY-MM-DD)`.

- **Default**: process only `- [ ]` items from sections matching today's date.
- **`--since Nd`**: process items from the last N days (e.g. `--since 2d` = today + yesterday).
- **`--all`**: process all `- [ ]` items in `## Pending` regardless of date.

Items in `## Archived` are **never** processed.

## Workflow

1. **Read** `data/pipeline.md` -> find `- [ ]` items in the "Pending" section whose section header matches the date filter (default: today)
2. **For each pending URL**:
   a. **PRE-FILTER** (see below) -- quick check against hard criteria. If it fails, mark `[!]` and skip. Do NOT spend tokens on a full evaluation.
   b. Calculate next sequential `REPORT_NUM` (read `reports/`, take highest number + 1)
   c. **Extract full JD** using Playwright (browser_navigate + browser_snapshot) -> WebFetch -> WebSearch
   d. If the URL is inaccessible -> mark as `- [!]` with a note and continue
   e. **Run triage (A+B only)** by default -> Tracker with status `Triage`. Full A-F only if user passes `--full` or explicitly requests it.
   f. **Move from "Pending" to "Processed"**: `- [x] #NNN | URL | Company | Role | Score/5 | PDF ✅/❌`
3. **If 3+ URLs are pending**, launch parallel agents (Agent tool with `run_in_background`) for speed.
4. **On completion**, show summary table:

---

## Step 0 -- Pre-filter (MANDATORY before evaluating)

**For EACH URL, before the full A-F evaluation:**

### 0. Check existing metadata first
If the pipeline.md entry already has location/remote/salary fields (e.g., from a previous scan), use them directly for the pre-filter check. Only fetch if fields are missing. This avoids redundant requests for entries that already have metadata.

### 1. Quick JD fetch
Use WebFetch (NOT Playwright -- too slow for pre-filter). If WebFetch fails, use WebSearch for the title + company. The goal is enough text to check 3 fields, not the full JD.

### 2. Extract only these 3 fields
- **Location / Remote:** Remote-first, hybrid, or fixed onsite? Which city?
- **Comp range:** Is salary or a range mentioned? (may not appear -- that's OK)
- **Work authorization:** Requires clearance, citizenship, or specific sponsorship?

### 3. Evaluate against candidate criteria (read `config/profile.yml`)

| Criterion | PASS | FAIL |
|-----------|------|------|
| **Remote** | Remote-first, hybrid with occasional travel, city where candidate accepts relocation | Fixed onsite in unacceptable city, no remote option |
| **Comp** | Range mentions >= $180K USD, or range not mentioned (continue with uncertainty) | Max range < $150K USD (clearly below walk-away) |
| **Auth** | No restrictions, or "no sponsorship needed" | Requires clearance/citizenship the candidate lacks |

**Uncertainty rule:** If the JD mentions neither salary nor remote policy, assume PASS and continue. Block D of the evaluation will resolve it.

### 4. Update pipeline.md metadata
After fetching, **update the entry in pipeline.md** with any newly discovered metadata (location, remote, salary). This way even entries that PASS pre-filter have their metadata visible for the user.

Example: entry was `- [ ] https://... | Acme | PM` -> update to `- [ ] https://... | Acme | PM | NYC | Hybrid | $180-250K`

### 5. If FAIL on any hard criterion
- Mark in pipeline.md: `- [!] SKIP: {concise reason} | {url} | {company} | {title} | {location} | {remote} | {salary}`
- Example: `- [!] SKIP: onsite Seoul + Korean required | https://... | Anthropic | Applied AI Engineer | Seoul | Onsite`
- Example: `- [!] SKIP: comp ceiling $120K below walk-away | https://... | SmallCo | Engineer | Austin | Onsite | $90-120K`
- **Do NOT run A-F evaluation.** Move to next URL.

### 6. If PASS
- Proceed to **triage (A+B only)** by default. Include the already-extracted location/comp data in Block A (no re-fetching).
- If user passed `--full`, run full A-F evaluation + report + PDF instead.

```
| # | Company | Role | Score | PDF | Recommended Action |
```

## pipeline.md Format

Each pending entry has pipe-separated fields. The first 3 are required; the rest are optional metadata captured at scan time or by the pre-filter:

```
- [ ] {url} | {company} | {title} | {location} | {remote} | {salary}
```

| Field | Required | Example |
|-------|----------|---------|
| `url` | Yes | `https://jobs.lever.co/mistral/abc123` |
| `company` | Yes | `Mistral AI` |
| `title` | Yes | `Technical Lead, FDE` |
| `location` | No | `Montreal, QC` / `San Francisco, CA` / `EMEA` |
| `remote` | No | `Remote` / `Hybrid` / `Onsite` |
| `salary` | No | `$200-300K` / `CA$180-240K` / `EUR80-120K` |

**Backward compatible:** Entries with only url/company/title (3 fields) are valid. The pre-filter will fetch missing metadata before evaluating.

```markdown
## Pending
- [ ] https://jobs.example.com/posting/123 | Acme Corp | AI PM | New York, NY | Hybrid | $180-250K
- [ ] https://boards.greenhouse.io/company/jobs/456 | Company Inc | Senior PM
- [ ] https://example.com/jobs/789 | BigCo | ML Engineer | Remote | Remote | $200-300K
- [!] SKIP: onsite Seoul + Korean required | https://private.url/job | OldCo | FDE
- [!] SKIP: comp ceiling $120K | https://other.url/job | SmallCo | Engineer | Austin, TX | Onsite | $90-120K

## Processed
- [x] #143 | https://jobs.example.com/posting/789 | Acme Corp | AI PM | 4.2/5 | PDF ✅
- [x] #144 | https://boards.greenhouse.io/xyz/jobs/012 | BigCo | SA | 2.1/5 | PDF ❌
```

## Smart JD Detection from URL

1. **Playwright (preferred):** `browser_navigate` + `browser_snapshot`. Works with all SPAs.
2. **WebFetch (fallback):** For static pages or when Playwright is unavailable.
3. **WebSearch (last resort):** Search secondary portals that index the JD.

**Special cases:**
- **LinkedIn**: May require login -> mark `[!]` and ask the user to paste the text
- **PDF**: If the URL points to a PDF, read it directly with the Read tool
- **`local:` prefix**: Read the local file. Example: `local:jds/linkedin-pm-ai.md` -> read `jds/linkedin-pm-ai.md`

## Automatic Numbering

1. List all files in `reports/`
2. Extract the number from the prefix (e.g., `142-medispend...` -> 142)
3. New number = max found + 1

## Source Sync

Before processing any URL, verify sync:
```bash
node cv-sync-check.mjs
```
If there's a desync, warn the user before continuing.
