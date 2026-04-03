/**
 * Select the "main" challenge — the incomplete challenge closest to completion.
 * @param {Array} challenges
 * @returns {{ main: object|null, side: Array }}
 */
export function getMainChallenge(challenges = []) {
  const incomplete = challenges.filter((c) => !c.completed);
  const completed = challenges.filter((c) => c.completed);

  if (incomplete.length === 0) {
    return { main: null, side: completed };
  }

  // Sort by progress ratio DESC → the one closest to finishing first
  const sorted = [...incomplete].sort((a, b) => {
    const ratioA = a.target > 0 ? a.progress / a.target : 0;
    const ratioB = b.target > 0 ? b.progress / b.target : 0;
    return ratioB - ratioA;
  });

  const [main, ...restIncomplete] = sorted;
  return { main, side: [...restIncomplete, ...completed] };
}
