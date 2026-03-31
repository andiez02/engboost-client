import { describe, it, expect } from 'vitest';
import React from 'react';
import { highlightWord } from '../highlightWord';

describe('highlightWord', () => {
  it('wraps matched word in a span and leaves rest as plain strings', () => {
    const result = highlightWord('The cat sat', 'cat');
    expect(result).toHaveLength(3);
    expect(result[0]).toBe('The ');
    expect(React.isValidElement(result[1])).toBe(true);
    expect(result[1].props.children).toBe('cat');
    expect(result[2]).toBe(' sat');
  });

  it('returns [""] when text is empty', () => {
    const result = highlightWord('', 'word');
    expect(result).toEqual(['']);
  });

  it('returns [text] when word is empty', () => {
    const result = highlightWord('hello', '');
    expect(result).toEqual(['hello']);
  });

  it('highlights all occurrences of the word', () => {
    const result = highlightWord('cat and cat', 'cat');
    const spans = result.filter((r) => React.isValidElement(r));
    expect(spans).toHaveLength(2);
  });

  it('matches case-insensitively and preserves original casing', () => {
    const result = highlightWord('The Cat sat', 'cat');
    const span = result.find((r) => React.isValidElement(r));
    expect(span).toBeDefined();
    expect(span.props.children).toBe('Cat');
  });

  it('handles regex special characters in word without throwing', () => {
    expect(() => highlightWord('price is $5.00', '$5.00')).not.toThrow();
  });

  it('returns [text] when word is not found', () => {
    const result = highlightWord('hello world', 'xyz');
    expect(result).toEqual(['hello world']);
  });
});
