# Mode: auto-pipeline — Full Automatic Pipeline

When the user pastes a JD (text or URL) without an explicit sub-command, run the ENTIRE pipeline in sequence:

## Step 0 -- Extract JD

Extract JD using the priority chain: Playwright (preferred for SPAs) -> WebFetch (static pages) -> WebSearch (last resort). If nothing works, ask the candidate to paste the JD.

If the input is JD text (not a URL): use directly, no fetch needed.

## Step 1 -- Evaluation A-F
Same as the `evaluate` mode (read `modes/evaluate.md` for all blocks A-F).

## Step 2 -- Save Report .md
Save the full evaluation to `reports/{###}-{company-slug}-{YYYY-MM-DD}.md` (see format in `modes/evaluate.md`).

## Step 3 -- Generate PDF
Run the full `pdf` pipeline (read `modes/pdf.md`).

## Step 4 -- Draft Application Answers (only if score >= 4.5)

If the final score is >= 4.5, draft answers for the application form:

1. **Extract form questions**: Use Playwright to navigate to the form and snapshot. If questions can't be extracted, use the generic questions below.
2. **Generate answers** following the Form Answer Tone framework in `modes/evaluate.md`.
3. **Save in the report** as section `## G) Draft Application Answers`.

### Generic questions (use if form questions can't be extracted)

- Why are you interested in this role?
- Why do you want to work at [Company]?
- Tell us about a relevant project or achievement
- What makes you a good fit for this position?
- How did you hear about this role?

**Language**: Always in the language of the JD (EN default). Apply `/tech-translate`.

## Step 5 -- Update Tracker
Register in `data/applications.md` with all columns including Report and PDF as ✅.

**If any step fails**, continue with the remaining steps and mark the failed step as pending in the tracker.
