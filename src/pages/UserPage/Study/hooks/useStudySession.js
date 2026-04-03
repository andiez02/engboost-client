import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDueCards,
  resetSession,
  submitReview,
  reinsertCard,
  selectCurrentCard,
  selectStudyProgress,
  selectSessionStartTime,
  selectIsTransitioning,
} from '../../../../redux/study/studySlice';

/**
 * Thin coordinator hook for the study session.
 * All session state lives in Redux — this hook only reads selectors and dispatches.
 *
 * @param {string|null} folderId - optional folder scope from URL params
 */
export function useStudySession(folderId) {
  const dispatch = useDispatch();

  // ── Redux state ──────────────────────────────────────────────────────────
  const currentCard     = useSelector(selectCurrentCard);
  const progress        = useSelector(selectStudyProgress);
  const sessionStartTime = useSelector(selectSessionStartTime);
  const isTransitioning = useSelector(selectIsTransitioning);
  const isFlipped       = useSelector((s) => s.study.isFlipped);
  const isLoading       = useSelector((s) => s.study.isLoading);
  const isSubmitting    = useSelector((s) => s.study.isSubmitting);
  const sessionDone     = useSelector((s) => s.study.sessionDone);
  const reviewedCount   = useSelector((s) => s.study.reviewedCount);
  const correctCount    = useSelector((s) => s.study.correctCount);
  const stats           = useSelector((s) => s.study.stats);
  const error           = useSelector((s) => s.study.error);
  const queueLength     = useSelector((s) => s.study.queue.length);
  const nextReviewAt    = useSelector((s) => s.study.nextReviewAt);

  // ── Session timer ────────────────────────────────────────────────────────
  const [sessionDuration, setSessionDuration] = useState(0);

  // Track when the current card was first shown (for response time logging)
  const cardShownAtRef = useRef(Date.now());
  const [responseTimeMs, setResponseTimeMs] = useState(null);
  const [lastRatingObj, setLastRatingObj] = useState({ cardId: null, rating: null });
  
  const currentCardId = currentCard?.id;
  useEffect(() => {
    cardShownAtRef.current = Date.now();
    setResponseTimeMs(null);
  }, [currentCardId]);

  useEffect(() => {
    if (!sessionStartTime || sessionDone) {
      setSessionDuration(
        sessionStartTime
          ? Math.floor((Date.now() - new Date(sessionStartTime).getTime()) / 1000)
          : 0
      );
      return;
    }

    const id = setInterval(() => {
      setSessionDuration(
        Math.floor((Date.now() - new Date(sessionStartTime).getTime()) / 1000)
      );
    }, 1000);

    return () => clearInterval(id);
  }, [sessionStartTime, sessionDone]);

  // ── Lifecycle ────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchDueCards(folderId));
    return () => {
      dispatch(resetSession());
    };
  }, [dispatch, folderId]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    (rating) => {
      if (!currentCard || isSubmitting || isTransitioning) return;
      const responseTime = Date.now() - cardShownAtRef.current;
      setResponseTimeMs(responseTime);
      setLastRatingObj({ cardId: currentCard.id, rating });
      // Reinsert before submitReview so queue is ready when advanceCard fires
      if (rating === 0) {
        dispatch(reinsertCard({ cardId: currentCard.id, card: currentCard }));
      }
      dispatch(submitReview({ cardId: currentCard.id, rating, responseTimeMs: responseTime }));
    },
    [currentCard, isSubmitting, isTransitioning, dispatch]
  );

  // ── Derived values ───────────────────────────────────────────────────────
  const { currentIndex, total, remaining } = progress;
  const progressPct = total > 0 ? currentIndex / total : 0;
  const nextCard = useSelector((s) => s.study.queue[s.study.currentIndex + 1] ?? null);
  const lastRating = lastRatingObj.cardId === currentCard?.id ? lastRatingObj.rating : null;

  return {
    // Card
    currentCard,
    nextCard,
    currentIndex,
    total,
    progress: progressPct,
    remaining,
    // Session state
    isCompleted: sessionDone,
    isFlipped,
    isLoading,
    isSubmitting,
    isTransitioning,
    error,
    // Stats
    sessionDuration,
    reviewed: reviewedCount,
    correct: correctCount,
    dueCount: stats?.due ?? 0,
    reviewedToday: stats?.reviewedToday ?? 0,
    queueLength,
    nextReviewAt,
    // Response time tracking
    responseTimeMs,
    lastRating,
    // Actions
    handleAnswer,
  };
}
