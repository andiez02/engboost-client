import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { flipCard, resetSession } from '../../../redux/study/studySlice';
import { useStudySession } from './useStudySession';
import FlashcardView from './FlashcardView';
import RatingButtons from './RatingButtons';
import EmptyStudy from './EmptyStudy';
import StudyHeader from './StudyHeader';
import LeaveSessionDialog from './LeaveSessionDialog';
import SessionFeedbackModal from '../Flashcard/SessionFeedbackModal';

export default function StudyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('folderId');
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const {
    currentCard,
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
    handleAnswer,
  } = useStudySession(folderId);
  const stats = useSelector((state) => state.study.stats);
  const xpGained = useSelector((state) => state.study.xpGained);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  const handleRate = useCallback(
    (rating) => {
      if (isSubmitting || isTransitioning) return;
      handleAnswer(rating);
    },
    [isSubmitting, isTransitioning, handleAnswer]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        dispatch(flipCard());
        return;
      }
      if (!isFlipped || isSubmitting || isTransitioning) return;
      const map = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (map[e.key] !== undefined) handleRate(map[e.key]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFlipped, isSubmitting, isTransitioning, handleRate, dispatch]);

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
        className="min-h-screen flex flex-col items-center justify-center px-4 py-6"
        style={{ background: 'linear-gradient(160deg, #f0f0ff 0%, #f8f8ff 50%, #f0f7ff 100%)' }}
      >
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {/* header */}
          <StudyHeader
            folderName={undefined}
            onLeave={() => setLeaveDialogOpen(true)}
            xpGained={xpGained}
          />

          {/* flashcard */}
          <FlashcardView card={currentCard} isTransitioning={isTransitioning} />

          {/* bottom area — fixed height prevents card from jumping when buttons appear */}
          <div className="h-32 flex flex-col items-center justify-center relative">
            <div
              className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200"
              style={{ opacity: isFlipped ? 0 : 1, pointerEvents: isFlipped ? 'none' : 'auto' }}
            >
              <p className="text-xs text-gray-400 text-center">
                Click the card or press{' '}
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[11px] font-mono">Space</kbd>{' '}
                to flip
              </p>
            </div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200"
              style={{ opacity: isFlipped ? 1 : 0, pointerEvents: isFlipped ? 'auto' : 'none' }}
            >
              <RatingButtons onRate={handleRate} disabled={isSubmitting || isTransitioning || !isFlipped} />
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
