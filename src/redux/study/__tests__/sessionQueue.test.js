import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { buildMixedQueue } from '../sessionQueue';

// ── Arbitraries ──────────────────────────────────────────────────────────────

const reviewCardArb = fc.record({
  id: fc.integer({ min: 1, max: 100000 }),
  repetition: fc.integer({ min: 1, max: 50 }),
  english: fc.string({ minLength: 1, maxLength: 20 }),
  vietnamese: fc.string({ minLength: 1, maxLength: 20 }),
  object: fc.option(fc.string({ minLength: 1, maxLength: 10 }), { nil: null }),
});

const newCardArb = reviewCardArb.map((c) => ({ ...c, repetition: 0 }));

const anyCardArb = fc.oneof(reviewCardArb, newCardArb);

// ── Tests ────────────────────────────────────────────────────────────────────

describe('buildMixedQueue', () => {
  // Feature: study-session-engine, Property 1: Queue length invariant
  it('P1: output length equals input length', () => {
    fc.assert(
      fc.property(fc.array(anyCardArb, { minLength: 1, maxLength: 30 }), (cards) => {
        expect(buildMixedQueue(cards)).toHaveLength(cards.length);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: study-session-engine, Property 2: Queue ID set invariant
  it('P2: output contains exactly the same card IDs as input', () => {
    fc.assert(
      fc.property(fc.array(anyCardArb, { minLength: 1, maxLength: 30 }), (cards) => {
        const inputIds = cards.map((c) => c.id).sort((a, b) => a - b);
        const outputIds = buildMixedQueue(cards).map((c) => c.id).sort((a, b) => a - b);
        expect(outputIds).toEqual(inputIds);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: study-session-engine, Property 3: All-review order preservation
  it('P3: all-review input preserves original order', () => {
    fc.assert(
      fc.property(fc.array(reviewCardArb, { minLength: 1, maxLength: 30 }), (cards) => {
        expect(buildMixedQueue(cards)).toEqual(cards);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: study-session-engine, Property 4: All-new order preservation
  it('P4: all-new input preserves original order', () => {
    fc.assert(
      fc.property(fc.array(newCardArb, { minLength: 1, maxLength: 30 }), (cards) => {
        expect(buildMixedQueue(cards)).toEqual(cards);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: study-session-engine, Property 5: Mixed queue — new card placement
  it('P5: first new card appears at index >= 2 when both types present', () => {
    fc.assert(
      fc.property(
        fc.array(reviewCardArb, { minLength: 2, maxLength: 15 }),
        fc.array(newCardArb, { minLength: 1, maxLength: 15 }),
        (reviews, news) => {
          const cards = [...reviews, ...news];
          const queue = buildMixedQueue(cards);
          const firstNewIdx = queue.findIndex((c) => c.repetition === 0);
          expect(firstNewIdx).toBeGreaterThanOrEqual(2);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: study-session-engine, Property 6: Determinism
  it('P6: same input always produces identical output', () => {
    fc.assert(
      fc.property(fc.array(anyCardArb, { minLength: 1, maxLength: 30 }), (cards) => {
        expect(buildMixedQueue(cards)).toEqual(buildMixedQueue(cards));
      }),
      { numRuns: 100 }
    );
  });
});
