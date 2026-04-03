import { useRef, useState, useEffect } from 'react';

/**
 * Detects when a challenge transitions from incomplete → complete.
 * Returns `justCompleted` (true for ~2s after transition) and `showReward` (for XP float).
 *
 * @param {boolean} completed - current completed state
 * @param {number}  rewardXp  - XP reward to display
 * @returns {{ justCompleted: boolean, showReward: boolean }}
 */
export function useCompletionDetector(completed, rewardXp) {
  const prevCompleted = useRef(completed);
  const [justCompleted, setJustCompleted] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    // Detect transition: false → true
    if (!prevCompleted.current && completed) {
      setJustCompleted(true);
      setShowReward(true);

      // Clear the "just completed" glow after animation
      const glowTimer = setTimeout(() => setJustCompleted(false), 2000);
      // Clear the floating XP text
      const rewardTimer = setTimeout(() => setShowReward(false), 1800);

      prevCompleted.current = completed;
      return () => {
        clearTimeout(glowTimer);
        clearTimeout(rewardTimer);
      };
    }
    prevCompleted.current = completed;
  }, [completed]);

  return { justCompleted, showReward };
}
