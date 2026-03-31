import { Box, ButtonBase, Typography } from '@mui/material';

const STEPS = [
  {
    key: 'study',
    label: 'Học ngay',
    caption: 'Ưu tiên thẻ đang chờ',
  },
  {
    key: 'weak',
    label: 'Ôn lại',
    caption: 'Củng cố thẻ khó',
  },
  {
    key: 'discover',
    label: 'Học từ mới',
    caption: 'Thêm nội dung mới',
  },
];

export default function LearningFlow({ due, reviewedToday }) {
  const activeIndex = due > 0 ? 0 : reviewedToday > 0 ? 1 : 2;

  return (
    <Box
      sx={{
        borderRadius: 4,
        bgcolor: '#fff',
        border: '2px solid #E5E5E5',
        borderBottom: '4px solid #E5E5E5',
        p: { xs: 2.5, md: 3 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#1CB0F6', boxShadow: '0 0 10px rgba(28, 176, 246, 0.5)' }} />
        <Typography fontSize="0.85rem" fontWeight={900} color="#1CB0F6" sx={{ letterSpacing: '0.05em' }}>
          LỘ TRÌNH HỌC
        </Typography>
      </Box>
      <Typography fontWeight={900} fontSize="1.3rem" sx={{ mt: 0.5, color: '#4B4B4B', letterSpacing: '-0.02em' }}>
        Bước tiếp theo của bạn
      </Typography>
      <Typography color="text.secondary" fontWeight={700} fontSize="0.95rem" sx={{ mt: 0.5 }}>
        Làm theo lộ trình để giữ nhịp học thật tốt nhé!
      </Typography>

      <Box
        sx={{
          mt: 4,
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 4, md: 8 },
          py: 4,
          overflowX: 'auto',
          minWidth: 0, // fixes flex overflow
        }}
      >
        {/* Wavy connecting line */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '72px', sm: '77px' }, // py:4=32 + height/2=40/45
            left: '16.66%',
            right: '16.66%',
            height: { xs: '24px', sm: '64px' }, // corresponds to the vertical offset below
            zIndex: 1,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <path 
              d="M 0 0 Q 50 200, 100 0" 
              fill="none" 
              stroke="#E5E5E5" 
              strokeWidth="6" 
              strokeDasharray="8 8"
              strokeLinecap="round"
              vectorEffect="nonScalingStroke"
            />
          </svg>
        </Box>

        {STEPS.map((step, index) => {
          const isActive = index === activeIndex;
          const isPassed = index < activeIndex; // steps before active
          
          // Node styling logic
          let nodeBg = '#E5E5E5';
          let nodeBorder = '#D5D5D5';
          let textColor = '#AFAFAF';
          let stepNumber = (index + 1).toString();

          if (isActive) {
            nodeBg = '#1CB0F6';
            nodeBorder = '#1899D6';
            textColor = '#1CB0F6';
          } else if (isPassed) {
            nodeBg = '#58CC02';
            nodeBorder = '#46A302';
            textColor = '#58CC02';
          }

          // Wavy vertical offset
          const verticalOffset = index % 2 === 1 ? { xs: 3, sm: 8 } : 0;

          return (
            <Box
              key={step.key}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
                flex: 1,
                mt: verticalOffset,
                minWidth: { xs: 120, sm: 160 },
              }}
            >
              {/* Node Button */}
              <ButtonBase
                disabled
                sx={{
                  width: { xs: 80, sm: 90 },
                  height: { xs: 80, sm: 90 },
                  borderRadius: '50%',
                  bgcolor: nodeBg,
                  color: '#fff',
                  border: '6px solid',
                  borderColor: nodeBorder,
                  borderBottomWidth: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '2.5rem',
                  boxShadow: isActive ? '0 12px 24px rgba(28, 176, 246, 0.4)' : 'none',
                  animation: isActive ? 'bounce 2s infinite ease-in-out' : 'none',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                  },
                  transition: 'all 0.2s',
                }}
              >
                <Typography sx={{ 
                  color: '#fff', 
                  fontFamily: 'monospace', 
                  fontSize: '2.5rem', 
                  fontWeight: 900, 
                  lineHeight: 1 
                }}>
                  {stepNumber}
                </Typography>
              </ButtonBase>

              {/* Floating Label */}
              <Box
                sx={{
                  mt: 2,
                  px: 3,
                  py: 1,
                  bgcolor: '#fff',
                  borderRadius: 4,
                  border: '2px solid #E5E5E5',
                  borderBottom: '4px solid #E5E5E5',
                  textAlign: 'center',
                  minWidth: 160,
                }}
              >
                <Typography fontWeight={900} fontSize="1rem" color={textColor} sx={{ letterSpacing: '0.02em' }}>
                  {step.label.toUpperCase()}
                </Typography>
                <Typography fontWeight={800} fontSize="0.75rem" color="#AFAFAF">
                  {step.caption}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
