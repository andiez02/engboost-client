/**
 * Builds a mixed study queue from a flat array of flashcards.
 *
 * Partitions cards into:
 *   - reviewCards: repetition > 0 (due cards the user has seen before)
 *   - newCards:    repetition === 0 (brand-new cards)
 *
 * Interleaves them in a review → review → new repeating pattern:
 *   slot index % 3 === 2  → take from newCards
 *   otherwise             → take from reviewCards
 *
 * When one group is exhausted, the remainder of the other is appended.
 *
 * @param {Array} cards - flat array of Flashcard objects from the API
 * @returns {Array} ordered queue ready for the study session
 */
export function buildMixedQueue(cards) {
  const reviewCards = cards.filter((c) => c.repetition > 0);
  const newCards = cards.filter((c) => c.repetition === 0);

  // Fast paths — no mixing needed
  if (newCards.length === 0) return [...reviewCards];
  if (reviewCards.length === 0) return [...newCards];

  const queue = [];
  let ri = 0; // review pointer
  let ni = 0; // new pointer
  let slot = 0;

  while (ri < reviewCards.length || ni < newCards.length) {
    const wantNew = slot % 3 === 2;

    if (wantNew && ni < newCards.length) {
      queue.push(newCards[ni++]);
    } else if (!wantNew && ri < reviewCards.length) {
      queue.push(reviewCards[ri++]);
    } else if (ri < reviewCards.length) {
      // new exhausted, fall back to review
      queue.push(reviewCards[ri++]);
    } else {
      // review exhausted, fall back to new
      queue.push(newCards[ni++]);
    }

    slot++;
  }

  return queue;
}

/**
 * Builds a priority-ordered study queue from pre-classified card buckets.
 * Order: learning first, then overdue, then interleaved due/newCards.
 *
 * @param {{ learning?: Flashcard[], overdue: Flashcard[], due: Flashcard[], newCards: Flashcard[] }} buckets
 * @returns {Flashcard[]}
 */
export function buildPriorityQueue({ learning = [], overdue, due, newCards }) {
  const queue = [...learning, ...overdue];
  const dueCopy = [...due];
  const newCopy = [...newCards];

  while (dueCopy.length || newCopy.length) {
    if (dueCopy.length) queue.push(dueCopy.shift());
    if (dueCopy.length) queue.push(dueCopy.shift());
    if (newCopy.length) queue.push(newCopy.shift());
  }

  return queue;
}
