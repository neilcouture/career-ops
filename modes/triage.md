# Mode: triage — Lightweight A+B Only

Quick evaluation: Block A (Role Summary) + Block B (CV Match) + Score. No report file, no PDF, no interview prep. Use this to decide if a role is worth a full evaluation.

## Step 0 -- Archetype Detection

Classify into archetype (see `_shared.md`). If hybrid, indicate the 2 closest.

## Block A -- Role Summary

Table with:
- Detected archetype
- Domain (platform/agentic/LLMOps/ML/enterprise)
- Function (build/consult/manage/deploy)
- Seniority
- Remote (full/hybrid/onsite)
- Team size (if mentioned)
- TL;DR in 1 sentence

## Block B -- CV Match

Read `cv.md`. Map each JD requirement to exact CV lines, adapted by archetype.

**Gaps** section: per gap, is it a hard blocker or nice-to-have? Adjacent experience? Mitigation?

## Score

Rate 1-5 based on A+B only. Show the score prominently.

## Verdict

One line: **Apply**, **Maybe** (needs full eval), or **Skip** (with reason).

If Apply or Maybe, ask: "Want me to run the full evaluation (C-F + report + PDF)?"

## Tracker

Write TSV to `batch/tracker-additions/` with status `Triage` and no PDF/report links. Run `node merge-tracker.mjs`.
