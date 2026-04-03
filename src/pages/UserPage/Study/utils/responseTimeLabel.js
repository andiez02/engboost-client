/**
 * Converts response time in milliseconds to a human-readable label with emoji.
 *
 * @param {number} ms - Response time in milliseconds
 * @returns {{ emoji: string, label: string, color: string }} Label object
 */
export function getResponseTimeLabel(ms) {
  if (ms < 1500) {
    return { emoji: '⚡', label: 'Fast', color: '#16A34A' }; // green
  }
  if (ms < 4000) {
    return { emoji: '👍', label: 'Good', color: '#6B7280' }; // gray
  }
  return { emoji: '🐢', label: 'Slow', color: '#9CA3AF' }; // light gray
}

/**
 * Formats response time as seconds with 1 decimal place.
 *
 * @param {number} ms - Response time in milliseconds
 * @returns {string} Formatted time like "2.3s"
 */
export function formatResponseTime(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}
