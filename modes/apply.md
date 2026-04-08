# Mode: apply — Live Application Assistant

Interactive mode for when the candidate is filling out an application form in Chrome. Reads what's on screen, loads prior offer context, and generates personalized answers for each form question.

## Requirements

- **Best with visible Playwright**: The candidate sees the browser and Claude can interact with the page.
- **Without Playwright**: The candidate shares a screenshot or pastes questions manually.

## Workflow

```
1. DETECT     -> Read active Chrome tab (screenshot/URL/title)
2. IDENTIFY   -> Extract company + role from page
3. SEARCH     -> Match against existing reports in reports/
4. LOAD       -> Read full report + Section G (if exists)
5. COMPARE    -> Does the on-screen role match the evaluated one? If changed -> warn
6. ANALYZE    -> Identify ALL visible form questions
7. GENERATE   -> For each question, generate personalized answer
8. PRESENT    -> Show formatted answers for copy-paste
```

## Step 1 — Detect the offer

**With Playwright:** Take a snapshot of the active page. Read title, URL, and visible content.

**Without Playwright:** Ask the candidate to:
- Share a screenshot of the form (Read tool reads images)
- Or paste the form questions as text
- Or provide company + role so we can look it up

## Step 2 — Identify and search context

1. Extract company name and role title from the page
2. Search `reports/` by company name (Grep case-insensitive)
3. If match -> load the full report
4. If Section G exists -> load prior draft answers as a base
5. If NO match -> notify and offer to run auto-pipeline first

## Step 3 — Detect role changes

If the on-screen role differs from the evaluated one:
- **Notify the candidate**: "The role changed from [X] to [Y]. Want me to re-evaluate or adapt the answers to the new title?"
- **If adapt**: Adjust answers to the new role without re-evaluating
- **If re-evaluate**: Run full A-F evaluation, update report, regenerate Section G
- **Update tracker**: Change role title in applications.md if appropriate

## Step 4 — Analyze form questions

Identify ALL visible questions:
- Free text fields (cover letter, why this role, etc.)
- Dropdowns (how did you hear, work authorization, etc.)
- Yes/No (relocation, visa, etc.)
- Salary fields (range, expectation)
- Upload fields (resume, cover letter PDF)

Classify each question:
- **Already answered in Section G** -> adapt the existing answer
- **New question** -> generate answer from report + cv.md

## Form Answer Tone

**Position: "I'm choosing you."** Candidate has options and is choosing this company for concrete reasons.

- **Confident without arrogance**: "I've spent the past year building production AI agent systems -- your role is where I want to apply that experience next"
- **Direct, no fluff**: 2-4 sentences per answer. No "I'm passionate about..." or "I would love the opportunity to..."
- **The hook is proof, not assertion**: Instead of "I'm great at X", say "I built X that does Y"
- **Why this role?** -> "Your [specific thing] maps directly to [specific thing I built]."
- **Why this company?** -> Mention something concrete. "I've been using [product] for [time/purpose]."
- **Relevant experience?** -> One quantified proof point. "Built [X] that [metric]."
- **Good fit?** -> "I sit at the intersection of [A] and [B], which is exactly where this role lives."
- **How did you hear?** -> Honest answer.

**Language**: Always in the language of the JD (EN default).

## Location Policy (for form fields)

- Binary "can you be on-site?" questions: follow actual availability from profile.yml
- In free-text fields: specify timezone overlap and availability

## Portfolio as Proof Point

If the candidate has a live demo/dashboard (check profile.yml), offer access in applications for relevant roles.

## Step 5 — Generate answers

For each question, generate the answer following:

1. **Report context**: Use proof points from Block B, STAR stories from Block F
2. **Prior Section G**: If a draft answer exists, use it as a base and refine
3. **Tone**: Follow the Form Answer Tone above
4. **Specificity**: Reference something concrete from the visible JD
5. **Portfolio**: Include demo/dashboard link in "Additional info" if there's a field for it

**Output format:**

```
## Answers for [Company] — [Role]

Based on: Report #NNN | Score: X.X/5 | Archetype: [type]

---

### 1. [Exact form question]
> [Answer ready for copy-paste]

### 2. [Next question]
> [Answer]

...

---

Notes:
- [Any observations about the role, changes, etc.]
- [Personalization suggestions the candidate should review]
```

## Step 6 — Post-apply (optional)

If the candidate confirms the application was submitted:
1. Update status in `applications.md` from "Evaluated" to "Applied"
2. Update Section G in the report with final answers
3. Suggest next step: `/career-ops outreach` for LinkedIn outreach

## Scroll handling

If the form has more questions than visible:
- Ask the candidate to scroll and share another screenshot
- Or paste the remaining questions
- Process in iterations until the entire form is covered
