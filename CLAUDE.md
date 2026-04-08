# Career-Ops

AI job search pipeline: scan portals → score matches → generate tailored CVs.

## Key Files

| File | Function |
|------|----------|
| `cv.md` | Canonical CV (source of truth) |
| `article-digest.md` | Detailed proof points (optional) |
| `config/profile.yml` | Candidate identity, targets, salary range |
| `portals.yml` | Portal + company config for scanner |
| `data/applications.md` | Application tracker |
| `data/pipeline.md` | Inbox of pending URLs |
| `templates/cv-template.html` | HTML template for PDF generation |
| `templates/states.yml` | Canonical statuses (source of truth) |
| `reports/` | Evaluation reports (`{###}-{company-slug}-{YYYY-MM-DD}.md`) |

## Commands

```bash
node generate-pdf.mjs       # Generate CV PDF from HTML
node scan-portals.mjs        # Scan portal APIs (Level 1), TSV to stdout
node scan-portals.mjs --write # Scan + append new entries to data/pipeline.md
node merge-tracker.mjs       # Merge batch TSV into applications.md
node verify-pipeline.mjs     # Health check
node normalize-statuses.mjs  # Fix non-canonical statuses
node dedup-tracker.mjs       # Remove duplicate entries
node cv-sync-check.mjs       # Check CV consistency
```

## Core Modes

| If the user... | Mode |
|----------------|------|
| Searches for new offers | `scan` |
| Processes pending URLs | `pipeline` (triage by default, `--full` for A-F) |
| Quick check (A+B only) | `triage` |
| Wants full evaluation | `evaluate` |
| Wants to generate CV/PDF | `pdf` |
| Pastes JD or URL | `auto-pipeline` |

Other modes exist in `modes/`: `compare`, `outreach`, `deep`, `training`, `project`, `tracker`, `apply`, `batch`.

## Rules

- **NEVER hardcode metrics** — read from cv.md + article-digest.md at evaluation time
- **NEVER submit applications** without user reviewing first
- **NEVER edit applications.md to ADD entries** — write TSV to `batch/tracker-additions/`, then `node merge-tracker.mjs`
- **YES edit applications.md to UPDATE** status/notes of existing entries
- **Offer verification**: use Playwright (browser_navigate + browser_snapshot), never trust WebSearch/WebFetch alone
- Discourage applications scoring below 3.0/5
- All reports MUST include `**URL:**` in header
- All statuses MUST be canonical (see `templates/states.yml`)

## TSV Format (tracker additions)

One file per evaluation: `batch/tracker-additions/{num}-{company-slug}.tsv`

```
{num}\t{date}\t{company}\t{role}\t{status}\t{score}/5\t{pdf_emoji}\t[{num}](reports/{num}-{slug}-{date}.md)\t{note}
```

Column order: num, date, company, role, **status**, **score**, pdf, report, notes.
In applications.md: score comes BEFORE status. The merge script swaps automatically.

## Onboarding

If `cv.md`, `config/profile.yml`, or `portals.yml` is missing, guide setup before proceeding.
