# Mode: evaluate — Full Evaluation A-F

When the candidate pastes an offer (text or URL), ALWAYS deliver all 6 blocks:

## Step 0 -- Archetype Detection

Classify the offer into one of the 6 archetypes (see `_shared.md`). If hybrid, indicate the 2 closest. This determines:
- Which proof points to prioritize in Block B
- How to rewrite the summary in Block E
- Which STAR stories to prepare in Block F

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

Read `cv.md`. Create a table mapping each JD requirement to exact CV lines.

**Adapted by archetype:**
- If FDE -> prioritize fast delivery and client-facing proof points
- If SA -> prioritize system design and integrations
- If PM -> prioritize product discovery and metrics
- If LLMOps -> prioritize evals, observability, pipelines
- If Agentic -> prioritize multi-agent, HITL, orchestration
- If Transformation -> prioritize change management, adoption, scaling

**Gaps** section with mitigation strategy for each. Per gap:
1. Is it a hard blocker or nice-to-have?
2. Can the candidate demonstrate adjacent experience?
3. Is there a portfolio project that covers this gap?
4. Concrete mitigation plan (cover letter phrase, quick project, etc.)

## Comp Intelligence (for Blocks C+D)

- Use WebSearch for current market data (Glassdoor, Levels.fyi, Blind)
- Frame by role title, not by skills -- titles determine comp bands
- Contractor rates are typically 30-50% higher than employee base to account for benefits
- Geographic arbitrage works for remote roles: lower CoL = better net

## Location Policy (for scoring)

- Remote dimension for hybrid outside candidate's country: score **3.0** (not 1.0)
- Only score 1.0 if JD explicitly says "must be on-site 4-5 days/week, no exceptions"

## Negotiation Scripts (for Block C)

**Salary expectations:**
> "Based on market data for this role, I'm targeting [RANGE from profile.yml]. I'm flexible on structure -- what matters is the total package and the opportunity."

**Geographic discount pushback:**
> "The roles I'm competitive for are output-based, not location-based. My track record doesn't change based on postal code."

**When offered below target:**
> "I'm comparing with opportunities in the [higher range]. I'm drawn to [company] because of [reason]. Can we explore [target]?"

---

## Block C -- Level and Strategy

1. **Detected level** in the JD vs **candidate's natural level for that archetype**
2. **"Sell senior without lying" plan**: specific phrases adapted to the archetype, concrete achievements to highlight, how to position founder experience as an advantage
3. **"If I get downleveled" plan**: accept if comp is fair, negotiate 6-month review, clear promotion criteria

## Block D -- Comp and Demand

Use WebSearch for:
- Current salaries for the role (Glassdoor, Levels.fyi, Blind)
- Company's compensation reputation
- Role demand trends

Table with data and cited sources. If no data, say so rather than inventing.

## Block E -- Customization Plan

| # | Section | Current State | Proposed Change | Why |
|---|---------|---------------|-----------------|-----|
| 1 | Summary | ... | ... | ... |
| ... | ... | ... | ... | ... |

Top 5 CV changes + Top 5 LinkedIn changes to maximize match.

## Block F -- Interview Plan

6-10 STAR+R stories mapped to JD requirements (STAR + **Reflection**):

| # | JD Requirement | STAR+R Story | S | T | A | R | Reflection |
|---|----------------|--------------|---|---|---|---|------------|

The **Reflection** column captures what was learned or what would be done differently. This signals seniority -- junior candidates describe what happened, senior candidates extract lessons.

**Story Bank:** If `interview-prep/story-bank.md` exists, check if any of these stories are already there. If not, append new ones. Over time this builds a reusable bank of 5-10 master stories adaptable to any interview question.

**Frame stories using the same archetype mapping from Block B.**

Also include:
- 1 recommended case study (which project to present and how)
- Red-flag questions and how to answer them (e.g., "Why did you sell your company?", "Do you have direct reports?")

---

## Post-evaluation

**ALWAYS** after generating blocks A-F:

### 1. Save report .md

Save the full evaluation to `reports/{###}-{company-slug}-{YYYY-MM-DD}.md`.

- `{###}` = next sequential number (3 digits, zero-padded)
- `{company-slug}` = company name in lowercase, no spaces (use hyphens)
- `{YYYY-MM-DD}` = current date

**Report format:**

```markdown
# Evaluation: {Company} -- {Role}

**Date:** {YYYY-MM-DD}
**Archetype:** {detected}
**Score:** {X/5}
**PDF:** {path or pending}

---

## A) Role Summary
(full Block A content)

## B) CV Match
(full Block B content)

## C) Level and Strategy
(full Block C content)

## D) Comp and Demand
(full Block D content)

## E) Customization Plan
(full Block E content)

## F) Interview Plan
(full Block F content)

## G) Draft Application Answers
(only if score >= 4.5 -- draft answers using Form Answer Tone below)

---

## Extracted Keywords
(list of 15-20 JD keywords for ATS optimization)
```

### Form Answer Tone (for Section G)

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

### 2. Register in tracker

**ALWAYS** register in `data/applications.md`:
- Next sequential number
- Current date
- Company
- Role
- Score: match average (1-5)
- Status: `Evaluated`
- PDF: (✅ or ❌)
- Report: relative link to the report .md (e.g., `[001](reports/001-company-2026-01-01.md)`)

**Tracker format:**

```markdown
| # | Date | Company | Role | Score | Status | PDF | Report |
```
