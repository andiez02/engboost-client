/**
 * Masks occurrences of a word in a sentence with underscores.
 * Used on flashcard FRONT to prevent answer leakage.
 *
 * @param {string} sentence - The full example sentence
 * @param {string} word - The word to mask
 * @returns {string} Sentence with word replaced by "____"
 */
export function maskWord(sentence, word) {
  if (!sentence || !word) return sentence;

  // Escape special regex characters
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Match word boundaries only, case-insensitive
  const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
  
  return sentence.replace(regex, '____');
}
