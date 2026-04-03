import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { flipCard, resetSession } from '../../../redux/study/studySlice';
import { useStudySession } from './hooks/useStudySession';
import StudyRenderer from './StudyRenderer';
import RatingButtons from './components/ui/RatingButtons';
import EmptyStudy from './components/layout/EmptyStudy';
import StudySidebar from './components/layout/StudySidebar';
import StudyHeader from './components/layout/StudyHeader';
import LeaveSessionDialog from './components/ui/LeaveSessionDialog';
import SessionFeedbackModal from '../Flashcard/SessionFeedbackModal';
import CloseIcon from '@mui/icons-material/Close';
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

  // ── Card answered state (for non-flip modes: MCQ and Typing) ────────────
  const [isCardAnswered, setIsCardAnswered] = useState(false);

  // Reset answered state when card changes
  useEffect(() => {
    setIsCardAnswered(false);
  }, [currentCard?.id]);

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

  // Show rating buttons:
  // - flip mode: only when card is flipped
  // - other modes: only when user has answered (MCQ selected / Typing submitted)
  const showRatingButtons = usesFlipMode
    ? isFlipped
    : isCardAnswered;

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;

      if (e.code === 'Space' && usesFlipMode) {
        e.preventDefault();
        dispatch(flipCard());
        return;
      }

      // Rating shortcuts: for flip mode only when flipped; for others when answered
      if (!showRatingButtons) return;
      if (isSubmitting || isTransitioning) return;
      const map = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (map[e.key] !== undefined) handleRate(map[e.key]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [usesFlipMode, showRatingButtons, isSubmitting, isTransitioning, handleRate, dispatch]);

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
                        onTypingSubmit={() => setIsCardAnswered(true)}
                        onMCQSelect={() => setIsCardAnswered(true)}
                        className="flex-1 min-h-0"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* UNIFIED BOTTOM ACTION AREA — same for all modes */}
              <div className="mt-6 w-full max-w-3xl relative h-24 flex flex-col items-center justify-center">
                {/* Flip hint (recall mode, not yet flipped) */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300"
                  style={{ opacity: (!showRatingButtons) ? 1 : 0, pointerEvents: !showRatingButtons ? 'auto' : 'none' }}
                >
                  {usesFlipMode ? (
                    <p className="text-[13px] font-bold text-[#AFAFAF] bg-white px-5 py-2.5 rounded-2xl border-2 border-[#E5E5E5] border-b-[4px]">
                      Nhấp vào thẻ hoặc nhấn{' '}
                      <kbd className="px-2 py-1 bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-[3px] rounded-lg text-[11px] font-mono font-black text-[#AFAFAF] mx-1">Space</kbd>{' '}
                      để lật
                    </p>
                  ) : null}
                </div>

                {/* Rating buttons — shown for all modes once answered/flipped */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300"
                  style={{ opacity: showRatingButtons ? 1 : 0, pointerEvents: showRatingButtons ? 'auto' : 'none' }}
                >
                  <RatingButtons
                    onRate={handleRate}
                    disabled={isSubmitting || isTransitioning || !showRatingButtons}
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
