import { Box, Typography, ButtonBase, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../utils/constants';

export default function ChallengeCard({ challenge }) {
  const navigate = useNavigate();
  const { title, description, progress, target, rewardXp, completed, icon } = challenge;
  const progressPercent = Math.min((progress / target) * 100, 100);

  const handleContinue = () => {
    navigate(routes.DASHBOARD); // For now, navigate back to dashboard/study
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 4,
        border: `2px solid ${completed ? '#E4F8EB' : '#E5E5E5'}`,
        borderBottom: `4px solid ${completed ? '#E4F8EB' : '#E5E5E5'}`,
        p: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 3,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        },
      }}
    >
      {/* Icon / Badge */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 3,
          bgcolor: completed ? '#E4FFF0' : '#F0F8FF',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Typography fontSize="1.8rem">
          {completed ? '✅' : (icon || '🎯')}
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, width: '100%' }}>
        <Typography fontWeight={800} fontSize="1.1rem" color="#4B4B4B" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        {description && (
          <Typography fontWeight={600} fontSize="0.85rem" color="#AFAFAF" sx={{ mb: 1.5 }}>
            {description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography fontWeight={700} fontSize="0.75rem" color={completed ? '#58CC02' : '#1CB0F6'}>
            {completed ? 'Hoàn thành' : 'Đang thực hiện'}
          </Typography>
          <Typography fontWeight={800} fontSize="0.75rem" color="#4B4B4B">
            {progress} / {target}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: '#E5E5E5',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              bgcolor: completed ? '#58CC02' : '#1CB0F6',
              transition: 'transform 0.4s ease',
            },
          }}
        />
      </Box>

      {/* Action / Reward */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'flex-start', md: 'flex-end' },
          gap: 1.5,
          minWidth: 140,
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: completed ? '#FFF8E1' : '#FAFAFA',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            border: `1px solid ${completed ? '#FFE082' : '#EFEFEF'}`,
          }}
        >
          <span style={{ fontSize: '1rem' }}>⚡</span>
          <Typography fontWeight={800} fontSize="0.8rem" color={completed ? '#FF9600' : '#AFAFAF'}>
            +{rewardXp} XP
          </Typography>
        </Box>

        {completed ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              bgcolor: '#F0F0F0',
              color: '#AFAFAF',
              fontSize: '0.9rem',
              fontWeight: 800,
              py: 1.5,
              px: 3,
              borderRadius: 3,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Đã nhận thưởng
          </Box>
        ) : (
          <ButtonBase
            onClick={handleContinue}
            sx={{
              width: '100%',
              bgcolor: '#1CB0F6',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 800,
              py: 1.5,
              px: 3,
              borderRadius: 3,
              borderBottom: '4px solid #1899D6',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.1s',
              '&:active': {
                transform: 'translateY(4px)',
                borderBottomWidth: 0,
                mb: '4px', // Prevent layout shift
              },
            }}
          >
            Học Tiếp
          </ButtonBase>
        )}
      </Box>
    </Box>
  );
}
