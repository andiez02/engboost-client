/**
 * Heuristic to detect if a string is a sentence vs. a short label.
 * 
 * A value is considered a sentence if:
 * - It contains a space AND ends with punctuation (.!?)
 * - OR it's longer than 20 characters
 * 
 * @param {string} value - The string to check
 * @returns {boolean} True if the value appears to be a sentence
 */
export function isSentence(value) {
  if (!value) return false;
  
  const trimmed = value.trim();
  return (
    (trimmed.includes(' ') && /[.!?]$/.test(trimmed)) ||
    trimmed.length > 20
  );
}
