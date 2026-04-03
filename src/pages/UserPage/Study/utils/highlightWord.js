import React from 'react';

/**
 * Splits `text` into segments, wrapping occurrences of `word` (case-insensitive)
 * in a styled <span>. Returns an array of React nodes.
 *
 * @param {string} text  - The full example sentence
 * @param {string} word  - The word to highlight
 * @param {object} options - Styling options
 * @returns {React.ReactNode[]}
 */
export function highlightWord(text, word, options = {}) {
  if (!text || !word) return [text];

  const {
    color = '#4F46E5',
    fontWeight = 700,
    textDecoration = 'none',
  } = options;

  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b(${escaped})\\b`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part)
      ? React.createElement(
          'span',
          {
            key: index,
            style: { fontWeight, color, textDecoration },
          },
          part
        )
      : part
  );
}
