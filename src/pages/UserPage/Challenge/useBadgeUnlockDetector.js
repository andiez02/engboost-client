import { useRef, useState, useEffect } from 'react';

/**
 * Detects when a real achievement transitions from locked to unlocked (unlocked: false -> true).
 * Pushes newly unlocked achievements into a queue to display sequentially.
 *
 * @param {Array} currentAchievements - Array of achievement objects from the real API
 */
export function useAchievementUnlockDetector(currentAchievements) {
  const prevAchievementsRef = useRef(null);
  const [unlockQueue, setUnlockQueue] = useState([]);

  useEffect(() => {
    if (!currentAchievements || currentAchievements.length === 0) return;

    // If we have a previous state, compare to find newly unlocked badges
    if (prevAchievementsRef.current) {
      const newlyUnlocked = currentAchievements.filter((curr) => {
        if (!curr.unlocked) return false;
        const prev = prevAchievementsRef.current.find((b) => b.id === curr.id);
        // It's newly unlocked if it was locked previously
        return prev && !prev.unlocked;
      });

      if (newlyUnlocked.length > 0) {
        setUnlockQueue((prev) => [...prev, ...newlyUnlocked]);
      }
    }

    prevAchievementsRef.current = currentAchievements;
  }, [currentAchievements]);

  // Dismiss the currently showing badge in the queue
  const dismissCurrentBadge = () => {
    setUnlockQueue((prev) => prev.slice(1));
  };

  return {
    currentUnlock: unlockQueue[0] || null,
    dismissCurrentBadge,
  };
}
