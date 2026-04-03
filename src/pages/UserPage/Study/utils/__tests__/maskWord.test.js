import { maskWord } from '../maskWord';

describe('maskWord', () => {
  it('should mask a single occurrence', () => {
    expect(maskWord('I love cats', 'cats')).toBe('I love ____');
  });

  it('should mask multiple occurrences', () => {
    expect(maskWord('Cats love cats', 'cats')).toBe('____ love ____');
  });

  it('should be case insensitive', () => {
    expect(maskWord('The Cat sat on the cat', 'cat')).toBe('The ____ sat on the ____');
  });

  it('should respect word boundaries', () => {
    expect(maskWord('I love cats and caterpillars', 'cat')).toBe('I love cats and caterpillars');
    expect(maskWord('I love cats and caterpillars', 'cats')).toBe('I love ____ and caterpillars');
  });

  it('should handle special regex characters', () => {
    expect(maskWord('Use $100 for the price', '$100')).toBe('Use ____ for the price');
    expect(maskWord('The (test) is here', '(test)')).toBe('The ____ is here');
  });

  it('should return original if word is empty', () => {
    expect(maskWord('Hello world', '')).toBe('Hello world');
  });

  it('should return original if sentence is empty', () => {
    expect(maskWord('', 'test')).toBe('');
  });

  it('should handle null/undefined gracefully', () => {
    expect(maskWord(null, 'test')).toBe(null);
    expect(maskWord('test', null)).toBe('test');
  });
});
