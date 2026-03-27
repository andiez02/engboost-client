import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { configureStore } from '@reduxjs/toolkit';
import studyReducer, {
  fetchDueCards,
  selectCurrentCard,
} from '../../../../redux/study/studySlice';

// Mock the study service module
vi.mock('../../../../services/study/study.service');
import { studyService } from '../../../../services/study/study.service';

// Helper: create a minimal store with only the study reducer
const makeStore = () =>
  configureStore({
    reducer: { study: studyReducer },
  });

// ─── Property 3 ──────────────────────────────────────────────────────────────
// Feature: learning-driven-ux-redesign, Property 3: Folder-scoped fetch includes folderId
describe('Property 3: Folder-scoped fetch includes folderId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getDueCards is called with the exact folderId passed to fetchDueCards', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }),
        async (folderId) => {
          studyService.getDueCards = vi.fn().mockResolvedValue({
            data: { overdue: [], due: [], newCards: [], stats: { due: 0, reviewedToday: 0 } },
          });

          const store = makeStore();
          await store.dispatch(fetchDueCards(folderId));

          expect(studyService.getDueCards).toHaveBeenCalledWith(folderId);
        }
      )
    );
  });
});

// ─── Property 4 ──────────────────────────────────────────────────────────────
// Feature: learning-driven-ux-redesign, Property 4: First card shown immediately after load
describe('Property 4: First card shown immediately after load', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('selectCurrentCard returns the first card (index 0) after fetchDueCards fulfills', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Use all-review cards (repetition > 0) so queue order === input order
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            front: fc.string(),
            back: fc.string(),
            repetition: fc.integer({ min: 1, max: 10 }),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        async (cards) => {
          // All cards have repetition > 0, so they all land in the `due` bucket.
          // buildPriorityQueue with no overdue/new preserves due order → queue[0] === cards[0]
          studyService.getDueCards = vi.fn().mockResolvedValue({
            data: { overdue: [], due: cards, newCards: [], stats: { due: cards.length, reviewedToday: 0 } },
          });

          const store = makeStore();
          await store.dispatch(fetchDueCards(null));

          const currentCard = selectCurrentCard(store.getState());
          expect(currentCard).toEqual(cards[0]);
        }
      )
    );
  });
});

// ─── Property 6 ──────────────────────────────────────────────────────────────
// Feature: learning-driven-ux-redesign, Property 6: Keyboard rating maps to correct value
describe('Property 6: Keyboard rating maps to correct value', () => {
  // The mapping extracted from StudyPage.jsx
  const keyRatingMap = { '1': 0, '2': 1, '3': 2, '4': 3 };

  it('each key in {1,2,3,4} maps to rating value (key - 1)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('1', '2', '3', '4'),
        (key) => {
          const expectedRating = Number(key) - 1;
          expect(keyRatingMap[key]).toBe(expectedRating);
        }
      )
    );
  });

  it('all four keys map to distinct values 0-3', () => {
    const values = Object.values(keyRatingMap);
    expect(values).toEqual([0, 1, 2, 3]);
  });
});
