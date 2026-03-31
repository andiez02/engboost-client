// Feature: flashcard-ui-upgrade, Property 2: highlightWord round-trip and span correctness
import { describe, it, expect } from 'vitest';
import React from 'react';
import * as fc from 'fast-check';
import { highlightWord } from '../highlightWord';

/**
 * Extracts the text content from a React node (span or plain string).
 */
function nodeText(node) {
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node.props.children ?? '';
  return '';
}

describe('highlightWord — Property 2: round-trip and span correctness', () => {
  it('concatenating all output segments equals the original text', () => {
    // Validates: Requirements 2.2, 2.3, 2.5, 6.4
    fc.assert(
      fc.property(fc.string(), fc.string(), (text, word) => {
        const result = highlightWord(text, word);
        const reconstructed = result.map(nodeText).join('');
        expect(reconstructed).toBe(text);
      }),
      { numRuns: 100 }
    );
  });

  it('segments matching word (case-insensitive) are React elements, not plain strings', () => {
    // Validates: Requirements 2.2, 2.5
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        (text, word) => {
          const result = highlightWord(text, word);
          const lowerWord = word.toLowerCase();
          result.forEach((node) => {
            const content = nodeText(node);
            if (content.toLowerCase() === lowerWord && content.length > 0) {
              // If this segment exactly matches the word, it must be a React element
              // (plain strings that happen to equal word are only possible when word
              // is not found — in that case the whole text is returned as one string)
              const isElement = React.isValidElement(node);
              const isWholeText = typeof node === 'string' && node === text;
              expect(isElement || isWholeText).toBe(true);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
