import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import FlashcardBack from '../FlashcardBack';

// Feature: flashcard-ui-upgrade, Property 5: FlashcardBack content ordering
describe('Property 5: FlashcardBack content ordering', () => {
  it('DOM order: MEANING label → Vietnamese meaning → "Rate your recall below", no <img>', () => {
    // Validates: Requirements 4.2
    fc.assert(
      fc.property(
        fc.record({
          english: fc.string(),
          vietnamese: fc.string({ minLength: 1 }),
        }),
        (card) => {
          const { container, unmount } = render(<FlashcardBack card={card} />);

          // No <img> element should ever be present
          const img = container.querySelector('img');
          expect(img).toBeNull();

          const allText = container.textContent || '';

          const meaningLabelPos = allText.indexOf('MEANING');
          const vietnamesePos = allText.indexOf(card.vietnamese, meaningLabelPos + 'MEANING'.length);
          const hintPos = allText.indexOf('Rate your recall below');

          // All three landmarks must be present
          expect(meaningLabelPos).toBeGreaterThanOrEqual(0);
          expect(vietnamesePos).toBeGreaterThan(meaningLabelPos);
          expect(hintPos).toBeGreaterThan(vietnamesePos);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
