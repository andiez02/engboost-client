import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { flipCard, resetFlip, resetSession } from '../../../redux/study/studySlice';
import { useStudySession } from './hooks/useStudySession';
import StudyRenderer from './StudyRenderer';
import RatingButtons from './components/ui/RatingButtons';
import EmptyStudy from './components/layout/EmptyStudy';
import StudySidebar from './components/layout/StudySidebar';
import StudyHeader from './components/layout/StudyHeader';
import LeaveSessionDialog from './components/ui/LeaveSessionDialog';
import SessionFeedbackModal from '../Flashcard/SessionFeedbackModal';
import { useCombo } from './hooks/useCombo';
import ComboIndicator from './components/ui/ComboIndicator';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('folderId');
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const {
    currentCard,
    nextCard,
    isCompleted,
    isFlipped,
    isLoading,
    isSubmitting,
    isTransitioning,
    error,
    sessionDuration,
    reviewed,
    correct,
    dueCount,
    reviewedToday,
    queueLength,
    nextReviewAt,
    responseTimeMs,
    lastRating,
    handleAnswer,
  } = useStudySession(folderId);
  const stats = useSelector((state) => state.study.stats);
  const xpGained = useSelector((state) => state.study.xpGained);

  const progress = queueLength + reviewed > 0 ? reviewed / (queueLength + reviewed) : 0;
  const streak = stats?.streak ?? 0;

  const { combo, sessionXp, lastXpEvent } = useCombo(lastRating, currentCard?.id);

  // Reset flip when advancing cards — avoids stuck state where rating/hint never match until full reload
  useEffect(() => {
    if (currentCard?.id) dispatch(resetFlip());
  }, [currentCard?.id, dispatch]);

  // ── Feedback Animations ──────────────────────────────────────────────────
  const feedbackVariants = {
    initial: { scale: 1, x: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', filter: 'none' },
    again: { 
      x: [-10, 10, -10, 10, 0], 
      backgroundColor: 'rgba(255, 230, 230, 0.9)',
      transition: { duration: 0.25 } 
    },
    hard: { 
      backgroundColor: 'rgba(255, 240, 220, 0.9)',
      filter: 'drop-shadow(0 0 10px rgba(255,150,0,0.3))',
      transition: { duration: 0.25 } 
    },
    good: { 
      backgroundColor: 'rgba(230, 255, 230, 0.9)',
      filter: 'drop-shadow(0 0 10px rgba(88,204,2,0.3))',
      transition: { duration: 0.25 } 
    },
    easy: { 
      scale: [1, 1.02, 1],
      backgroundColor: 'rgba(220, 245, 255, 0.9)',
      filter: 'drop-shadow(0 0 10px rgba(28,176,246,0.3))',
      transition: { duration: 0.25 } 
    }
  };

  let animateState = 'initial';
  if (lastRating !== null) {
    if (lastRating === 0) animateState = 'again';
    else if (lastRating === 1) animateState = 'hard';
    else if (lastRating === 2) animateState = 'good';
    else if (lastRating === 3) animateState = 'easy';
  }

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  const handleRate = useCallback(
    (rating) => {
      if (isSubmitting || isTransitioning) return;
      handleAnswer(rating);
    },
    [isSubmitting, isTransitioning, handleAnswer]
  );

  // Determine if current card uses flip mode (recall) or direct interaction (mcq/typing/image)
  const usesFlipMode = !currentCard?.studyMode || currentCard?.studyMode === 'recall';

  // Always show the rating bar while a card is active (avoids hidden UI / stuck state without reload)
  const ratingInteractive = !isSubmitting && !isTransitioning;

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;

      if (e.code === 'Space' && usesFlipMode) {
        e.preventDefault();
        dispatch(flipCard());
        return;
      }

      if (!ratingInteractive) return;
      const map = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (map[e.key] !== undefined) handleRate(map[e.key]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [usesFlipMode, ratingInteractive, isSubmitting, isTransitioning, handleRate, dispatch]);

  const handleReview = () => {
    const target = folderId ? `/study?folderId=${folderId}` : '/study';
    dispatch(resetSession());
    navigate(target, { replace: true });
  };

  /* ── loading ── */
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#4F46E5' }} />
      </Box>
    );
  }

  /* ── error ── */
  if (error) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Typography color="error">
          {typeof error === 'string' ? error : 'Something went wrong.'}
        </Typography>
      </Box>
    );
  }

  /* ── session complete ── */
  // If no cards were ever loaded
  if (isCompleted && queueLength === 0) {
    return <EmptyStudy variant="no-cards" nextReviewAt={nextReviewAt} reviewedToday={reviewedToday} folderId={folderId} />;
  }

  /* ── empty states ── */
  if (!currentCard && !isCompleted) {
    const variant = folderId ? 'folder-empty' : 'caught-up';
    return <EmptyStudy variant={variant} nextReviewAt={nextReviewAt} reviewedToday={reviewedToday} folderId={folderId} />;
  }

  /* ── study UI ── */
  return (
    <>
      <div
        className="min-h-screen px-4 py-6 md:px-6 md:py-8 bg-slate-50"
      >
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
          
          {/* HEADER (FULL WIDTH) */}
          <StudyHeader
            streak={streak}
            sessionXp={sessionXp}
            lastXpEvent={lastXpEvent}
            progress={progress}
            sessionDuration={sessionDuration}
            onLeave={() => setLeaveDialogOpen(true)}
          />

          {/* GRID LAYOUT */}
          <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-8">
            
            {/* SIDEBAR (LEFT PANEL) - Hidden on smaller screens */}
            <div className="hidden lg:block">
              <StudySidebar
                reviewed={reviewed}
                correct={correct}
                queueLength={queueLength}
                dueCount={dueCount}
                nextReviewAt={nextReviewAt}
                sessionDuration={sessionDuration}
              />
            </div>

            {/* MAIN STUDY AREA (RIGHT PANEL) */}
            <div className="flex flex-col items-center justify-center min-h-[600px] w-full">
              
              {/* Card Container — fixed height for all modes */}
              <div className="relative w-full max-w-3xl group">
                {/* Background Focus Overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-blue-200/40 blur-xl opacity-60 pointer-events-none" />

                <ComboIndicator combo={combo} />
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={currentCard?.id}
                    initial={{ opacity: 0, x: 150, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -150, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28, mass: 0.5 }}
                    className="w-full relative"
                  >
                    <motion.div
                      variants={feedbackVariants}
                      initial="initial"
                      animate={animateState}
                      whileHover={{ y: -2 }}
                      className={`relative w-full eb-card-glass overflow-hidden flex flex-col transition-shadow duration-300 ${
                        lastRating >= 2 ? 'shadow-[0_0_40px_rgba(34,197,94,0.25)]' : ''
                      }`}
                      style={{ height: 420 }}
                    >
                      {/* Rating label overlay */}
                      {lastRating !== null && (
                        <div className="absolute top-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
                          <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`px-4 py-2 rounded-2xl font-black text-white shadow-sm ${
                              lastRating >= 2 ? 'bg-[#58CC02]' : lastRating === 1 ? 'bg-[#FF9600]' : 'bg-[#FF4B4B]'
                            }`}
                          >
                            {lastRating >= 2 ? '✓ Tuyệt vời!' : lastRating === 1 ? '! Nhớ máng máng' : '✗ Cần ôn lại'}
                          </motion.div>
                        </div>
                      )}

                      <StudyRenderer
                        card={currentCard}
                        nextCard={nextCard}
                        isTransitioning={isTransitioning}
                        responseTimeMs={responseTimeMs}
                        lastRating={lastRating}
                        onAnswer={handleRate}
                        className="flex-1 min-h-0"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* BOTTOM: optional flip hint + rating always visible */}
              <div className="mt-6 w-full max-w-3xl flex flex-col items-center justify-center gap-3 min-h-[120px]">
                {usesFlipMode && !isFlipped && (
                  <p className="text-[12px] font-bold text-[#AFAFAF] text-center px-3">
                    Nhấp thẻ hoặc{' '}
                    <kbd className="px-1.5 py-0.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded text-[10px] font-mono">Space</kbd>{' '}
                    để lật — bạn vẫn có thể chấm điểm bên dưới
                  </p>
                )}
                <div className="w-full flex flex-col items-center justify-center">
                  <RatingButtons
                    onRate={handleRate}
                    disabled={!ratingInteractive}
                    combo={combo}
                  />
                </div>
              </div>
            </div>

            {/* MOBILE SIDEBAR FALLBACK - Stacked below main content on small screens */}
            <div className="block lg:hidden mt-8">
              <StudySidebar
                reviewed={reviewed}
                correct={correct}
                queueLength={queueLength}
                dueCount={dueCount}
                nextReviewAt={nextReviewAt}
                sessionDuration={sessionDuration}
              />
            </div>
            
          </div>
        </div>
      </div>
      <LeaveSessionDialog
        open={leaveDialogOpen}
        onCancel={() => setLeaveDialogOpen(false)}
        onConfirm={() => { dispatch(resetSession()); navigate('/dashboard'); }}
      />
      
      {/* Session Feedback Modal */}
      {isCompleted && queueLength > 0 && (
        <SessionFeedbackModal
          reviewedCount={reviewed}
          correctCount={correct}
          sessionDuration={sessionDuration}
          streak={stats?.streak ?? 0}
          xpGained={xpGained}
          onClose={handleReview}
        />
      )}
    </>
  );
}
