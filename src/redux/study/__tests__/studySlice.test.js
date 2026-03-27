import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import studyReducer, {
  flipCard,
  resetSession,
  buildQueue,
  advanceCard,
  submitReview,
  selectCurrentCard,
  selectStudyProgress,
} from '../studySlice';

// ── Shared initial state (matches slice initialState) ────────────────────────
const initialState = {
  queue: [],
  currentIndex: 0,
  isFlipped: false,
  isLoading: false,
  isSubmitting: false,
  isTransitioning: false,
  error: null,
  stats: null,
  sessionDone: false,
  reviewedCount: 0,
  correctCount: 0,
  sessionStartTime: null,
};

const toRootState = (studyState) => ({ study: studyState });

// ── Arbitraries ──────────────────────────────────────────────────────────────
const cardArb = fc.record({
  id: fc.integer({ min: 1, max: 100000 }),
  repetition: fc.nat(),
  english: fc.string({ minLength: 1, maxLength: 20 }),
  vietnamese: fc.string({ minLength: 1, maxLength: 20 }),
});

const ratingArb = fc.integer({ min: 0, max: 3 });

// ── Existing properties (updated for queue field) ────────────────────────────

// Feature: learning-driven-ux-redesign, Property 5: Flip toggles isFlipped state
describe('Property 5: Flip toggles isFlipped state', () => {
  it('dispatching flipCard() always inverts isFlipped', () => {
    fc.assert(
      fc.property(fc.boolean(), (initialFlipped) => {
        const state = { ...initialState, isFlipped: initialFlipped };
        const next = studyReducer(state, flipCard());
        expect(next.isFlipped).toBe(!initialFlipped);
      })
    );
  });
});

// Feature: learning-driven-ux-redesign, Property 8: submitReview failure does not advance card
describe('Property 8: submitReview failure does not advance card', () => {
  it('rejected action leaves currentIndex unchanged and sets error', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10 }),
        fc.string(),
        (currentIndex, errorMsg) => {
          const state = { ...initialState, currentIndex, isSubmitting: true, error: null };
          const action = submitReview.rejected(
            new Error(errorMsg), '', { cardId: 'x', rating: 1 }, errorMsg
          );
          const next = studyReducer(state, action);
          expect(next.currentIndex).toBe(currentIndex);
          expect(next.isSubmitting).toBe(false);
          expect(next.error).not.toBeNull();
        }
      )
    );
  });
});

// ── New properties for study-session-engine ──────────────────────────────────

// Feature: study-session-engine, Property 7: buildQueue initializes Redux state correctly
describe('Property 7: buildQueue initializes Redux state correctly', () => {
  it('queue.length === cards.length and currentIndex === 0 after buildQueue', () => {
    fc.assert(
      fc.property(fc.array(cardArb, { minLength: 1, maxLength: 20 }), (cards) => {
        const next = studyReducer(initialState, buildQueue(cards));
        expect(next.queue).toHaveLength(cards.length);
        expect(next.currentIndex).toBe(0);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: study-session-engine, Property 8: submitReview.fulfilled increments reviewedCount
describe('Property 8: submitReview.fulfilled increments reviewedCount', () => {
  it('reviewedCount increments by exactly 1 for any rating', () => {
    fc.assert(
      fc.property(
        fc.array(cardArb, { minLength: 2, maxLength: 20 }),
        fc.integer({ min: 0, max: 18 }),
        ratingArb,
        (cards, idx, rating) => {
          const currentIndex = idx % (cards.length - 1); // ensure not last card
          const state = { ...initialState, queue: cards, currentIndex, reviewedCount: 5 };
          const action = submitReview.fulfilled({}, '', { cardId: 'x', rating });
          const next = studyReducer(state, action);
          expect(next.reviewedCount).toBe(6);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: study-session-engine, Property 9: Correct/incorrect count tracking
describe('Property 9: Correct/incorrect count tracking', () => {
  it('correctCount increments for rating >= 2, unchanged for rating < 2', () => {
    fc.assert(
      fc.property(
        fc.array(cardArb, { minLength: 2, maxLength: 20 }),
        ratingArb,
        (cards, rating) => {
          const state = { ...initialState, queue: cards, currentIndex: 0, correctCount: 3 };
          const action = submitReview.fulfilled({}, '', { cardId: 'x', rating });
          const next = studyReducer(state, action);
          if (rating >= 2) {
            expect(next.correctCount).toBe(4);
          } else {
            expect(next.correctCount).toBe(3);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: study-session-engine, Property 10: Session completion after full queue
describe('Property 10: Session completion after full queue', () => {
  it('sessionDone is true after advanceCard is called N times for N-card queue', () => {
    fc.assert(
      fc.property(fc.array(cardArb, { minLength: 1, maxLength: 20 }), (cards) => {
        let state = { ...initialState, queue: cards, currentIndex: 0 };
        for (let i = 0; i < cards.length; i++) {
          state = studyReducer(state, advanceCard());
        }
        expect(state.sessionDone).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: study-session-engine, Property 11: resetSession restores initial state
describe('Property 11: resetSession restores initial state', () => {
  it('all session fields return to initial values after resetSession', () => {
    fc.assert(
      fc.property(
        fc.record({
          queue: fc.array(cardArb, { minLength: 1, maxLength: 10 }),
          currentIndex: fc.integer({ min: 1, max: 9 }),
          isFlipped: fc.boolean(),
          isTransitioning: fc.boolean(),
          sessionDone: fc.boolean(),
          reviewedCount: fc.integer({ min: 1, max: 20 }),
          correctCount: fc.integer({ min: 1, max: 20 }),
          sessionStartTime: fc.oneof(fc.string(), fc.constant(null)),
        }),
        (overrides) => {
          const state = { ...initialState, ...overrides };
          const next = studyReducer(state, resetSession());
          expect(next.queue).toEqual([]);
          expect(next.currentIndex).toBe(0);
          expect(next.isFlipped).toBe(false);
          expect(next.isTransitioning).toBe(false);
          expect(next.sessionDone).toBe(false);
          expect(next.reviewedCount).toBe(0);
          expect(next.correctCount).toBe(0);
          expect(next.sessionStartTime).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: study-session-engine, Property 12: Session progress invariants
describe('Property 12: Session progress invariants', () => {
  it('progress in [0,1], remaining+currentIndex===total, isCompleted===sessionDone', () => {
    fc.assert(
      fc.property(
        fc.array(cardArb, { minLength: 1, maxLength: 20 }).chain((cards) =>
          fc.tuple(
            fc.constant(cards),
            fc.integer({ min: 0, max: cards.length - 1 })
          )
        ),
        fc.boolean(),
        ([cards, currentIndex], sessionDone) => {
          const rootState = toRootState({ ...initialState, queue: cards, currentIndex, sessionDone });
          const p = selectStudyProgress(rootState);
          expect(p.progress).toBeGreaterThanOrEqual(0);
          expect(p.progress).toBeLessThanOrEqual(1);
          expect(p.remaining + currentIndex).toBe(p.total);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: study-session-engine, Property 14: selectCurrentCard returns correct card or null
describe('Property 14: selectCurrentCard returns correct card or null', () => {
  it('returns queue[currentIndex] or null when out of bounds / empty', () => {
    fc.assert(
      fc.property(
        fc.array(cardArb, { maxLength: 10 }),
        fc.integer({ min: 0, max: 15 }),
        (queue, currentIndex) => {
          const rootState = toRootState({ ...initialState, queue, currentIndex });
          const result = selectCurrentCard(rootState);
          if (queue.length === 0 || currentIndex >= queue.length) {
            expect(result).toBeNull();
          } else {
            expect(result).toEqual(queue[currentIndex]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
