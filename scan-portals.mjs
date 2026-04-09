#!/usr/bin/env node
/**
 * scan-portals.mjs — Fetch job listings from portal APIs, filter, dedup, output TSV
 *
 * Calls Greenhouse / Ashby / Lever APIs for all enabled tracked_companies in portals.yml.
 * Filters by title keywords, deduplicates against scan-history.tsv + pipeline.md + applications.md.
 * Outputs new matches as TSV to stdout (for Claude to analyze) and appends to scan-history.tsv.
 *
 * Run: node scan-portals.mjs [--dry-run] [--write]
 *   --dry-run   Print results but don't write scan-history.tsv
 *   --write     Also append new entries to pipeline.md (default: TSV to stdout only)
 */

import { readFileSync, appendFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('.', import.meta.url).pathname;
const PORTALS_FILE = join(ROOT, 'portals.yml');
const HISTORY_FILE = join(ROOT, 'data/scan-history.tsv');
const PIPELINE_FILE = join(ROOT, 'data/pipeline.md');
const APPS_FILE = join(ROOT, 'data/applications.md');

const DRY_RUN = process.argv.includes('--dry-run');
const WRITE_PIPELINE = process.argv.includes('--write');
const TODAY = new Date().toISOString().slice(0, 10);

// ── YAML-lite parser for portals.yml ──────────────────────────────────────────
// Only extracts what we need: title_filter and tracked_companies with api fields.

function parsePortals(text) {
  const titleFilter = { positive: [], negative: [], seniority_boost: [] };
  const companies = [];

  // Extract title_filter arrays
  for (const section of ['positive', 'negative', 'seniority_boost']) {
    const re = new RegExp(`^[ \\t]+${section}:[ \\t]*\\n((?:[ \\t]*(?:#[^\\n]*|-\\s*"[^"]*")[ \\t]*\\n)*)`, 'gm');
    const m = re.exec(text);
    if (m) {
      titleFilter[section] = [...m[1].matchAll(/"([^"]*)"/g)].map(x => x[1]);
    }
  }

  // Extract tracked_companies
  const companyBlocks = text.split(/^  - name:\s*/m).slice(1);
  for (const block of companyBlocks) {
    const lines = block.split('\n');
    const name = lines[0].trim();
    const get = (key) => {
      const line = lines.find(l => l.match(new RegExp(`^\\s+${key}:\\s`)));
      if (!line) return null;
      return line.replace(new RegExp(`^\\s+${key}:\\s+`), '').trim();
    };
    const enabled = get('enabled');
    const api = get('api');
    if (enabled === 'true' && api) {
      companies.push({ name, api, careers_url: get('careers_url') || '' });
    }
  }

  return { titleFilter, companies };
}

// ── Title filter ──────────────────────────────────────────────────────────────

function matchesTitle(title, filter) {
  const lower = title.toLowerCase();
  const hasPositive = filter.positive.some(kw => lower.includes(kw.toLowerCase()));
  const hasNegative = filter.negative.some(kw => lower.includes(kw.toLowerCase()));
  return hasPositive && !hasNegative;
}

function hasSeniorityBoost(title, filter) {
  const lower = title.toLowerCase();
  return filter.seniority_boost.some(kw => lower.includes(kw.toLowerCase()));
}

// ── Dedup set ─────────────────────────────────────────────────────────────────

function buildSeenUrls() {
  const seen = new Set();

  // scan-history.tsv — only skip URLs that were actually added or intentionally skipped as dup
  // (skipped_title entries are re-evaluated so a fixed filter can catch previously missed roles)
  if (existsSync(HISTORY_FILE)) {
    for (const line of readFileSync(HISTORY_FILE, 'utf8').split('\n').slice(1)) {
      const parts = line.split('\t');
      const url = parts[0];
      const status = parts[8];
      if (url && status !== 'skipped_title') seen.add(url);
    }
  }

  // pipeline.md — extract URLs
  if (existsSync(PIPELINE_FILE)) {
    for (const m of readFileSync(PIPELINE_FILE, 'utf8').matchAll(/https?:\/\/[^\s|)]+/g)) {
      seen.add(m[0]);
    }
  }

  // applications.md — extract URLs
  if (existsSync(APPS_FILE)) {
    for (const m of readFileSync(APPS_FILE, 'utf8').matchAll(/https?:\/\/[^\s|)]+/g)) {
      seen.add(m[0]);
    }
  }

  return seen;
}

// ── API fetchers ──────────────────────────────────────────────────────────────

async function fetchGreenhouse(company) {
  const res = await fetch(company.api);
  if (!res.ok) return { jobs: [], error: `${res.status} ${res.statusText}` };
  const data = await res.json();
  return {
    jobs: (data.jobs || []).map(j => ({
      title: j.title,
      url: j.absolute_url,
      location: j.location?.name || '',
      company: company.name,
    })),
  };
}

async function fetchAshby(company) {
  const res = await fetch(company.api);
  if (!res.ok) return { jobs: [], error: `${res.status} ${res.statusText}` };
  const data = await res.json();
  return {
    jobs: (data.jobs || []).map(j => ({
      title: j.title,
      url: j.jobUrl || j.applyUrl || '',
      location: j.location || j.locationName || '',
      company: company.name,
    })),
  };
}

async function fetchLever(company) {
  const res = await fetch(company.api);
  if (!res.ok) return { jobs: [], error: `${res.status} ${res.statusText}` };
  const data = await res.json();
  return {
    jobs: (Array.isArray(data) ? data : []).map(j => ({
      title: j.text || '',
      url: j.hostedUrl || '',
      location: j.categories?.location || '',
      company: company.name,
    })),
  };
}

function detectPlatform(apiUrl) {
  if (apiUrl.includes('greenhouse.io')) return 'greenhouse';
  if (apiUrl.includes('ashbyhq.com')) return 'ashby';
  if (apiUrl.includes('lever.co')) return 'lever';
  return 'unknown';
}

async function fetchCompany(company) {
  const platform = detectPlatform(company.api);
  switch (platform) {
    case 'greenhouse': return fetchGreenhouse(company);
    case 'ashby': return fetchAshby(company);
    case 'lever': return fetchLever(company);
    default: return { jobs: [], error: `Unknown platform: ${company.api}` };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const portalsText = readFileSync(PORTALS_FILE, 'utf8');
  const { titleFilter, companies } = parsePortals(portalsText);
  const seenUrls = buildSeenUrls();

  console.error(`Scanning ${companies.length} companies with APIs...`);

  // Fetch all in parallel
  const results = await Promise.allSettled(
    companies.map(async (c) => {
      try {
        const result = await fetchCompany(c);
        if (result.error) console.error(`  ✗ ${c.name}: ${result.error}`);
        else console.error(`  ✓ ${c.name}: ${result.jobs.length} jobs`);
        return { company: c, ...result };
      } catch (e) {
        console.error(`  ✗ ${c.name}: ${e.message}`);
        return { company: c, jobs: [], error: e.message };
      }
    })
  );

  const allJobs = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value.jobs);

  console.error(`\nTotal jobs fetched: ${allJobs.length}`);

  // Filter and categorize
  const added = [];
  const skippedTitle = [];
  const skippedDup = [];
  const historyLines = [];

  for (const job of allJobs) {
    const platform = 'api';

    if (seenUrls.has(job.url)) {
      skippedDup.push(job);
      continue;
    }
    seenUrls.add(job.url); // prevent intra-scan dupes

    if (!matchesTitle(job.title, titleFilter)) {
      skippedTitle.push(job);
      historyLines.push([job.url, TODAY, platform, job.title, job.company, job.location, '', '', 'skipped_title'].join('\t'));
      continue;
    }

    const boost = hasSeniorityBoost(job.title, titleFilter) ? ' ★' : '';
    added.push({ ...job, boost });
    historyLines.push([job.url, TODAY, platform, job.title, job.company, job.location, '', '', 'added'].join('\t'));
  }

  // Output results as TSV to stdout
  console.log('company\ttitle\tlocation\turl\tboost');
  for (const j of added) {
    console.log([j.company, j.title, j.location, j.url, j.boost.trim()].join('\t'));
  }

  // Summary to stderr
  console.error(`\n━━━ Scan Summary ━━━`);
  console.error(`Companies scanned: ${companies.length}`);
  console.error(`Total jobs fetched: ${allJobs.length}`);
  console.error(`Title matches: ${added.length}`);
  console.error(`Filtered by title: ${skippedTitle.length}`);
  console.error(`Duplicates (already seen): ${skippedDup.length}`);

  // Write scan history
  if (!DRY_RUN && historyLines.length > 0) {
    appendFileSync(HISTORY_FILE, historyLines.join('\n') + '\n');
    console.error(`\nAppended ${historyLines.length} entries to scan-history.tsv`);
  }

  // Optionally write to pipeline.md
  if (WRITE_PIPELINE && !DRY_RUN && added.length > 0) {
    const pipelineEntries = added.map(j =>
      `- [ ] ${j.url} | ${j.company} | ${j.title} | ${j.location}`
    );
    const section = `\n### API scan — ${TODAY}\n\n${pipelineEntries.join('\n')}\n`;

    const content = readFileSync(PIPELINE_FILE, 'utf8');
    const pendingIdx = content.indexOf('## Pending');
    if (pendingIdx !== -1) {
      // Find end of Pending section (next ## or EOF)
      const nextSection = content.indexOf('\n## ', pendingIdx + 10);
      const insertAt = nextSection !== -1 ? nextSection : content.length;
      const updated = content.slice(0, insertAt) + section + content.slice(insertAt);
      const { writeFileSync } = await import('fs');
      writeFileSync(PIPELINE_FILE, updated);
      console.error(`Added ${added.length} entries to pipeline.md`);
    }
  }

  if (DRY_RUN) console.error('\n(dry run — no files written)');
}

main().catch(e => { console.error(e); process.exit(1); });
