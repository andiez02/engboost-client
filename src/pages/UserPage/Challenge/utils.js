/**
 * Select the "main" challenge — the incomplete challenge with the highest priority.
 * @param {Array} challenges
 * @returns {{ main: object|null, side: Array }}
 */
export function getMainChallenge(challenges = []) {
  const incomplete = challenges.filter((c) => !c.completed);
  const completed = challenges.filter((c) => c.completed);

  if (incomplete.length === 0) {
    return { main: null, side: completed };
  }

  // Sort by priority DESC → the highest-priority challenge becomes main
  const sorted = [...incomplete].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  const [main, ...restIncomplete] = sorted;
  return { main, side: [...restIncomplete, ...completed] };
}
