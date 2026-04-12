#!/usr/bin/env node
/**
 * prefilter-pipeline.mjs
 *
 * Pre-filters data/pipeline.md to keep only entries that are plausibly viable
 * for someone based in Toronto, Canada:
 *   - Canada mentions (any province, "CAN", "Canada", "Toronto", etc.)
 *   - True global/international remote (not US-restricted)
 *   - No location field (ambiguous — keep for manual review)
 *
 * Discards:
 *   - US-only remote ("Remote US", "United States", US cities with no Canada/global signal)
 *   - Onsite/hybrid in non-Canada locations
 *   - EMEA/APAC/LATAM only with no remote signal
 *
 * Usage:
 *   node prefilter-pipeline.mjs            # dry run — print counts + sample discards
 *   node prefilter-pipeline.mjs --write    # rewrite pipeline.md in-place
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PIPELINE_FILE = join(ROOT, 'data/pipeline.md');
const DRY_RUN = !process.argv.includes('--write');

const text = readFileSync(PIPELINE_FILE, 'utf8');
const lines = text.split('\n');

// ── Classification helpers ──────────────────────────────────────────────────

const CANADA_RE = /\b(canada|canadian|CAN\b|toronto|montreal|vancouver|calgary|ottawa|ontario|quebec|bc\b|alberta)\b/i;

// Signals that mean "truly global remote" — company hires internationally
const GLOBAL_REMOTE_RE = /\b(remote global|global remote|worldwide|anywhere|international|remote[-\s]*emea|remote[-\s]*apac|remote[-\s]*latam)\b/i;

// Signals that mean US-only remote
const US_ONLY_RE = /\b(remote[,\s]+us\b|remote[,\s]+usa\b|remote[,\s]+united states|us[-\s]*remote|usa[-\s]*remote|remote in the us|united states \(remote\)|remote,?\s*united states|remote - us|US-Remote)\b/i;

// Clearly non-viable onsite/geo signals (no canada/remote attached)
const ONSITE_NON_VIABLE_RE = /\b(london|berlin|munich|paris|amsterdam|singapore|tokyo|sydney|dubai|india|bangalore|bengaluru|israel|tel aviv|stockholm|oslo|copenhagen|madrid|zurich|warsaw|prague|bucharest|sao paulo|mexico city|bogota|lima|jakarta|seoul|beijing|shanghai)\b/i;

// US cities — if location ONLY has these and no remote/canada signal, skip
const US_CITY_RE = /\b(san francisco|new york|new york city|nyc|boston|seattle|austin|chicago|denver|los angeles|miami|washington[,\s]dc|atlanta|dallas|houston|portland|phoenix|raleigh|pittsburgh|minneapolis|baltimore|philadelphia|nashville)\b/i;

function classify(line) {
  // Only process pending checkboxes
  if (!line.startsWith('- [ ]')) return 'keep'; // non-entry lines always kept

  // Extract location field (4th pipe-delimited field, if present)
  const parts = line.split(' | ');
  const location = parts.length >= 4 ? parts.slice(3).join(' | ').trim() : '';

  // No location = drop (user wants remote only, can't confirm)
  if (!location) return 'skip_unknown';

  const loc = location;
  const hasRemote = /\bremote\b/i.test(loc);
  const hasCanada = CANADA_RE.test(loc);
  const hasUS = US_CITY_RE.test(loc) || /united states|US-Remote|Remote US/i.test(loc);

  // Must be remote
  if (!hasRemote) {
    // Exception: Canada onsite/hybrid is still viable
    if (hasCanada) return 'keep_canada_onsite';
    return 'skip_not_remote';
  }

  // Remote + Canada = keep
  if (hasCanada) return 'keep_canada_remote';

  // Remote + global signal = keep
  if (GLOBAL_REMOTE_RE.test(loc)) return 'keep_global_remote';

  // Remote + US only = skip (requires sponsorship, usually not offered)
  if (US_ONLY_RE.test(loc)) return 'skip_us_remote';

  // Remote but foreign-only (London, Berlin, etc.) = skip
  if (ONSITE_NON_VIABLE_RE.test(loc) && !hasUS) return 'skip_remote_foreign';

  // Remote + US city (ambiguous on sponsorship) = keep for now
  if (hasUS) return 'keep_us_remote_ambiguous';

  // Remote + unknown geo = keep
  return 'keep_remote_unknown';
}

// ── Process ─────────────────────────────────────────────────────────────────

const counts = {};
const kept = [];
const discarded = [];

for (const line of lines) {
  const verdict = classify(line);
  counts[verdict] = (counts[verdict] || 0) + 1;

  if (verdict.startsWith('skip')) {
    discarded.push({ line, verdict });
  } else {
    kept.push(line);
  }
}

// ── Report ───────────────────────────────────────────────────────────────────

const totalEntries = lines.filter(l => l.startsWith('- [ ]')).length;
const keptEntries = kept.filter(l => l.startsWith('- [ ]')).length;
const discardedEntries = discarded.length;

console.log(`\nPre-filter summary`);
console.log(`══════════════════`);
console.log(`Total pending:     ${totalEntries}`);
console.log(`Kept:              ${keptEntries}`);
console.log(`Discarded:         ${discardedEntries}`);
console.log();
console.log('Breakdown:');
for (const [k, v] of Object.entries(counts).sort()) {
  console.log(`  ${k.padEnd(28)} ${v}`);
}

console.log('\nSample discards (first 15):');
for (const { line, verdict } of discarded.slice(0, 15)) {
  const short = line.length > 120 ? line.slice(0, 120) + '…' : line;
  console.log(`  [${verdict}] ${short}`);
}

if (DRY_RUN) {
  console.log('\n(dry run) — pass --write to apply');
} else {
  // Rebuild file: keep non-entry lines + kept entries, strip blank line runs
  const output = kept.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
  writeFileSync(PIPELINE_FILE, output);
  console.log(`\nWrote filtered pipeline.md (${keptEntries} entries kept)`);
}
