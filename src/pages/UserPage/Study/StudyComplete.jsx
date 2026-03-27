import { useNavigate } from 'react-router-dom';
import { Box, Typography, ButtonBase, Divider } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

function getEncouragement(accuracy) {
  if (accuracy >= 90) return { text: 'Outstanding!', emoji: '🔥' };
  if (accuracy >= 70) return { text: 'Great job!', emoji: '💪' };
  if (accuracy >= 50) return { text: 'Good effort!', emoji: '📚' };
  return { text: 'Keep going!', emoji: '🌱' };
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function StatChip({ label, value, bg, textColor }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 3, py: 2, borderRadius: 3, bgcolor: bg, minWidth: 88 }}>
      <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', lineHeight: 1, color: textColor }}>{value}</Typography>
      <Typography variant="caption" sx={{ mt: 0.5, color: textColor, opacity: 0.7, fontWeight: 500 }}>{label}</Typography>
    </Box>
  );
}

function ActionButton({ label, icon, onClick, primary }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        py: primary ? 1.75 : 1.4,
        borderRadius: 3,
        fontWeight: 700,
        fontSize: primary ? '0.95rem' : '0.875rem',
        transition: 'all 0.15s ease',
        ...(primary ? {
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: '#fff',
          boxShadow: '0 4px 16px rgba(79,70,229,0.35)',
          '&:hover': { filter: 'brightness(1.08)', transform: 'translateY(-1px)' },
        } : {
          bgcolor: 'rgba(79,70,229,0.06)',
          color: '#4F46E5',
          border: '1.5px solid rgba(79,70,229,0.15)',
          '&:hover': { bgcolor: 'rgba(79,70,229,0.1)' },
        }),
      }}
    >
      <Box sx={{ display: 'flex', fontSize: '1.1rem' }}>{icon}</Box>
      <span>{label}</span>
    </ButtonBase>
  );
}

export default function StudyComplete({ reviewed, correct, dueCount = 0, folderId, onReview, sessionDuration = 0 }) {
  const navigate = useNavigate();
  const accuracy = reviewed > 0 ? Math.round((correct / reviewed) * 100) : 0;
  const { text, emoji } = getEncouragement(accuracy);
  const hasDue = dueCount > 0;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f0f0ff 0%, #f8f8ff 50%, #f0f7ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2,
      py: 6,
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: 440,
        bgcolor: '#fff',
        borderRadius: 5,
        boxShadow: '0 8px 48px rgba(79,70,229,0.12)',
        border: '1.5px solid rgba(79,70,229,0.08)',
        p: { xs: 3, sm: 4.5 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}>

        {/* emoji badge */}
        <Box sx={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
          fontSize: 32,
        }}>
          {emoji}
        </Box>

        {/* title */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.3px' }}>
            Session Complete!
          </Typography>
          <Typography color="text.secondary" fontSize="0.95rem" sx={{ mt: 0.5 }}>
            {text} Keep up the momentum.
          </Typography>
        </Box>

        {/* stats */}
        {reviewed > 0 && (
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <StatChip label="Reviewed" value={reviewed} bg="rgba(79,70,229,0.07)" textColor="#4F46E5" />
            <StatChip label="Correct" value={correct} bg="rgba(22,163,74,0.08)" textColor="#16A34A" />
            <StatChip label="Accuracy" value={`${accuracy}%`} bg="rgba(217,119,6,0.08)" textColor="#D97706" />
            <StatChip label="Time" value={formatDuration(sessionDuration)} bg="rgba(79,70,229,0.05)" textColor="#6366F1" />
          </Box>
        )}

        <Divider sx={{ width: '100%', borderColor: 'rgba(79,70,229,0.08)' }} />

        {/* actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
          {hasDue ? (
            <ActionButton
              primary
              label={`Continue Review (${dueCount} due)`}
              icon={<ReplayIcon fontSize="small" />}
              onClick={onReview}
            />
          ) : (
            <ActionButton
              primary
              label="All done for today! 🎉"
              icon={<AutoAwesomeIcon fontSize="small" />}
              onClick={() => navigate('/dashboard')}
            />
          )}
          {hasDue && (
            <ActionButton
              label="Learn New Topic"
              icon={<AutoAwesomeIcon fontSize="small" />}
              onClick={() => navigate('/flashcard/folders')}
            />
          )}
          <ActionButton
            label="Back to Dashboard"
            icon={<AutoAwesomeIcon fontSize="small" />}
            onClick={() => navigate('/dashboard')}
          />
          <ActionButton
            label="Scan Image"
            icon={<CameraAltIcon fontSize="small" />}
            onClick={() => navigate('/flashcard/snaplang')}
          />
        </Box>
      </Box>
    </Box>
  );
}
