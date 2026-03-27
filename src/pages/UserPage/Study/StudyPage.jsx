import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import { flipCard, resetSession } from '../../../redux/study/studySlice';
import { useStudySession } from './useStudySession';
import FlashcardView from './FlashcardView';
import RatingButtons from './RatingButtons';
import StudyComplete from './StudyComplete';
import EmptyStudy from './EmptyStudy';
import StudyHeader from './StudyHeader';
import LeaveSessionDialog from './LeaveSessionDialog';

export default function StudyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('folderId');
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const {
    currentCard,
    currentIndex,
    total,
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
  if (isCompleted) {
    if (queueLength === 0) {
      return <EmptyStudy variant="no-cards" nextReviewAt={nextReviewAt} reviewedToday={reviewedToday} folderId={folderId} />;
    }
    return (
      <Fade in timeout={400}>
        <div>
          <StudyComplete
            reviewed={reviewed}
            correct={correct}
            dueCount={dueCount}
            folderId={folderId}
            sessionDuration={sessionDuration}
            onReview={handleReview}
          />
        </div>
      </Fade>
    );
  }

  /* ── empty states ── */
  if (!currentCard && !isCompleted) {
    const variant = folderId ? 'folder-empty' : 'caught-up';
    return <EmptyStudy variant={variant} nextReviewAt={nextReviewAt} reviewedToday={reviewedToday} folderId={folderId} />;
  }

  /* ── study UI ── */
  return (
    <>
      <Fade in timeout={300}>
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #f0f0ff 0%, #f8f8ff 50%, #f0f7ff 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            py: 4,
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* header */}
            <StudyHeader
              folderName={undefined}
              onLeave={() => setLeaveDialogOpen(true)}
            />

            {/* flashcard */}
            <FlashcardView card={currentCard} isTransitioning={isTransitioning} />

            {/* bottom area — fixed height so card never shifts */}
            <Box sx={{ height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {isFlipped ? (
                <RatingButtons onRate={handleRate} disabled={isSubmitting || isTransitioning} />
              ) : (
                <Typography variant="caption" color="text.disabled" textAlign="center">
                  Click the card or press{' '}
                  <Box
                    component="kbd"
                    sx={{
                      px: 0.75,
                      py: 0.25,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      fontSize: '0.7rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    Space
                  </Box>{' '}
                  to flip
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Fade>
      <LeaveSessionDialog
        open={leaveDialogOpen}
        onCancel={() => setLeaveDialogOpen(false)}
        onConfirm={() => { dispatch(resetSession()); navigate('/dashboard'); }}
      />
    </>
  );
}
