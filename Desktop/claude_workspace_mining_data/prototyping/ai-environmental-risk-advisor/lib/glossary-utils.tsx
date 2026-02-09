import React from 'react';
import { GlossaryTerm } from '@/components/GlossaryTerm';
import { glossary } from '@/lib/dummy-data';

/**
 * Scans a text string for glossary terms and wraps the first occurrence
 * of each term with a <GlossaryTerm> tooltip component.
 *
 * Rules:
 * - Longer terms matched first (so "Environmental Impact Assessment" beats "EIA")
 * - Case-insensitive matching with word boundaries
 * - First occurrence only per term per text block
 * - Overlap detection prevents double-matching the same character range
 * - Returns original string if no matches
 */
export function withGlossaryTerms(text: string): React.ReactNode {
  // Sort glossary keys by length descending so longer matches take priority
  const sortedTerms = Object.keys(glossary).sort((a, b) => b.length - a.length);

  // Find all first-occurrence matches with their positions
  interface Match {
    term: string;
    definition: string;
    start: number;
    end: number;
    matchedText: string;
  }

  const matches: Match[] = [];
  const matchedTermKeys = new Set<string>();

  for (const term of sortedTerms) {
    if (matchedTermKeys.has(term)) continue;

    // Escape regex special characters in the term
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    const match = regex.exec(text);

    if (!match) continue;

    const start = match.index;
    const end = start + match[0].length;

    // Check for overlap with existing matches
    const overlaps = matches.some(
      (m) => start < m.end && end > m.start
    );
    if (overlaps) continue;

    matches.push({
      term,
      definition: glossary[term],
      start,
      end,
      matchedText: match[0],
    });
    matchedTermKeys.add(term);
  }

  if (matches.length === 0) {
    return text;
  }

  // Sort matches by position for left-to-right assembly
  matches.sort((a, b) => a.start - b.start);

  const fragments: React.ReactNode[] = [];
  let cursor = 0;

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];

    // Text before this match
    if (m.start > cursor) {
      fragments.push(text.slice(cursor, m.start));
    }

    // The glossary term
    fragments.push(
      <GlossaryTerm key={`gl-${i}`} term={m.term} definition={m.definition}>
        {m.matchedText}
      </GlossaryTerm>
    );

    cursor = m.end;
  }

  // Remaining text after last match
  if (cursor < text.length) {
    fragments.push(text.slice(cursor));
  }

  return <>{fragments}</>;
}
