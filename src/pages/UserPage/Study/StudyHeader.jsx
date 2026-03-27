import { useSelector } from 'react-redux';
import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { selectStudyProgress } from '../../../redux/study/studySlice';

export default function StudyHeader({ folderName, onLeave }) {
  const progress = useSelector(selectStudyProgress);
  const pct = progress.total > 0
    ? Math.round(((progress.current - 1) / progress.total) * 100)
    : 0;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* top row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton onClick={onLeave} size="small" aria-label="leave session"
          sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          {folderName ?? 'Study Session'}
        </Typography>

        <Typography variant="body2" sx={{ fontWeight: 700, color: '#4F46E5', minWidth: 48, textAlign: 'right' }}>
          {progress.current - 1} / {progress.total}
        </Typography>
      </Box>

      {/* progress bar */}
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 6,
          borderRadius: '999px',
          bgcolor: 'rgba(79,70,229,0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
          },
        }}
      />
    </Box>
  );
}
