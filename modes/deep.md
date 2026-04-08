# Mode: deep — Deep Company Research

Generates a structured prompt for Perplexity/Claude/ChatGPT with 6 axes:

```
## Deep Research: [Company] — [Role]

Context: I'm evaluating an application for [role] at [company]. I need actionable intel for the interview.

### 1. AI Strategy
- What products/features use AI/ML?
- What's their AI stack? (models, infra, tools)
- Do they have an engineering blog? What do they publish?
- Any papers or talks on AI?

### 2. Recent Moves (last 6 months)
- Relevant hires in AI/ML/product?
- Acquisitions or partnerships?
- Product launches or pivots?
- Funding rounds or leadership changes?

### 3. Engineering Culture
- How do they ship? (deploy cadence, CI/CD)
- Mono-repo or multi-repo?
- Languages/frameworks?
- Remote-first or office-first?
- Glassdoor/Blind reviews on eng culture?

### 4. Likely Challenges
- Scaling problems?
- Reliability, cost, latency challenges?
- Migrating anything? (infra, models, platforms)
- Pain points mentioned in reviews?

### 5. Competitors and Differentiation
- Who are the main competitors?
- What's their moat/differentiator?
- How do they position vs competition?

### 6. Candidate Angle
Given my profile (read from cv.md and profile.yml for specific experience):
- What unique value do I bring to this team?
- Which of my projects are most relevant?
- What story should I tell in the interview?
```

Customize each section with the specific context of the evaluated offer.
