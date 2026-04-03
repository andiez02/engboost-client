import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useSound } from './useSound';

export function useCombo(lastRating, currentCardId) {
  const [combo, setCombo] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [lastXpEvent, setLastXpEvent] = useState(null);
  const processedCardRef = useRef(null);
  
  const { playPop, playDing, playThud } = useSound();

  useEffect(() => {
    if (lastRating !== null && currentCardId && processedCardRef.current !== currentCardId) {
      const XP_MAP = { 0: 1, 1: 3, 2: 5, 3: 8 };
      const baseXp = XP_MAP[lastRating] || 1;

      if (lastRating >= 2) {
        setCombo((prevCombo) => {
          const newCombo = prevCombo + 1;
          const earnedXp = Math.floor(baseXp * (1 + prevCombo * 0.1));
          
          setSessionXp((prevXp) => prevXp + earnedXp);
          setLastXpEvent({ id: currentCardId, amount: earnedXp, isCombo: prevCombo >= 1 });
          
          if ([3, 5, 10].includes(newCombo)) {
            playDing();
            if (newCombo >= 5) {
              confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFC800', '#FF9600', '#58CC02', '#1CB0F6']
              });
            }
          } else {
            playPop();
          }

          return newCombo;
        });
      } else {
        setCombo(0);
        setSessionXp((prevXp) => prevXp + baseXp);
        setLastXpEvent({ id: currentCardId, amount: baseXp, isCombo: false });
        
        if (lastRating === 0) {
          playThud();
        } else {
          playPop();
        }
      }
      processedCardRef.current = currentCardId;
    }
  }, [lastRating, currentCardId, playPop, playDing, playThud]);

  useEffect(() => {
    if (!currentCardId) {
      setCombo(0);
      setSessionXp(0);
      setLastXpEvent(null);
      processedCardRef.current = null;
    }
  }, [currentCardId]);

  return { combo, sessionXp, lastXpEvent };
}
