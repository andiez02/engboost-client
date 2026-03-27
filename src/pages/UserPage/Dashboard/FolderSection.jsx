import { useNavigate } from 'react-router-dom';
import { Box, Typography, ButtonBase, Skeleton } from '@mui/material';

export default function FolderSection({ folders = [], isLoading }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Typography
          fontSize="0.72rem"
          fontWeight={700}
          color="text.disabled"
          sx={{ letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.5 }}
        >
          Bộ thẻ của bạn
        </Typography>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} variant="rectangular" height={72} sx={{ borderRadius: 3 }} />
        ))}
      </Box>
    );
  }

  const sorted = [...folders].sort((a, b) => {
    const aVal = a.due_count ?? -1;
    const bVal = b.due_count ?? -1;
    return bVal - aVal;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography
        fontSize="0.72rem"
        fontWeight={700}
        color="text.disabled"
        sx={{ letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.5 }}
      >
        Bộ thẻ của bạn
      </Typography>

      {sorted.length === 0 ? (
        <Box sx={{
          borderRadius: 4,
          border: '1.5px dashed rgba(79,70,229,0.2)',
          bgcolor: 'rgba(79,70,229,0.03)',
          px: 3,
          py: 3.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
          textAlign: 'center',
        }}>
          <Typography fontSize="1.5rem">📂</Typography>
          <Box>
            <Typography fontWeight={700} fontSize="0.9rem" color="text.primary">
              Chưa có bộ nào
            </Typography>
            <Typography fontSize="0.8rem" color="text.secondary" sx={{ mt: 0.25 }}>
              Tạo một bộ để bắt đầu sắp xếp các thẻ của bạn.
            </Typography>
          </Box>
          <ButtonBase
            onClick={() => navigate('/flashcard/folders')}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              bgcolor: 'rgba(79,70,229,0.08)',
              color: '#4F46E5',
              fontWeight: 700,
              fontSize: '0.8rem',
              border: '1.5px solid rgba(79,70,229,0.14)',
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: 'rgba(79,70,229,0.14)' },
            }}
          >
            Tạo bộ
          </ButtonBase>
        </Box>
      ) : (
        sorted.map((folder) => {
          const dueCount = folder.due_count ?? 0;
          const totalCount = folder.flashcard_count ?? 0;
          const hasDue = dueCount > 0;
          const isEmpty = totalCount === 0;

          return (
            <Box
              key={folder._id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                borderRadius: 3,
                border: hasDue
                  ? '1.5px solid rgba(79,70,229,0.22)'
                  : '1.5px solid rgba(79,70,229,0.08)',
                borderLeft: hasDue ? '4px solid #4F46E5' : '1.5px solid rgba(79,70,229,0.08)',
                bgcolor: hasDue ? 'rgba(79,70,229,0.03)' : '#fff',
                boxShadow: hasDue
                  ? '0 2px 12px rgba(79,70,229,0.08)'
                  : '0 1px 6px rgba(0,0,0,0.04)',
                px: 2.5,
                py: 1.75,
                minHeight: 72,
                transition: 'box-shadow 0.15s ease',
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  fontWeight={700}
                  fontSize="0.92rem"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: isEmpty ? 'text.disabled' : 'text.primary',
                  }}
                >
                  {folder.title}
                </Typography>
                <Typography fontSize="0.78rem" color="text.secondary" sx={{ mt: 0.25 }}>
                  {isEmpty
                    ? 'Chưa có thẻ nào'
                    : `${dueCount} thẻ chờ / ${totalCount} tổng`}
                </Typography>
              </Box>

              <ButtonBase
                onClick={() => navigate(`/study?folderId=${folder._id}`)}
                disabled={isEmpty}
                sx={{
                  flexShrink: 0,
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  background: hasDue
                    ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                    : 'rgba(79,70,229,0.08)',
                  color: hasDue ? '#fff' : '#4F46E5',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  boxShadow: hasDue ? '0 4px 12px rgba(79,70,229,0.22)' : 'none',
                  opacity: isEmpty ? 0.4 : 1,
                  cursor: isEmpty ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': isEmpty
                    ? {}
                    : hasDue
                      ? { filter: 'brightness(1.08)', transform: 'translateY(-1px)' }
                      : { bgcolor: 'rgba(79,70,229,0.14)' },
                }}
              >
                {hasDue ? 'Học bộ này' : 'Xem'}
              </ButtonBase>
            </Box>
          );
        })
      )}
    </Box>
  );
}
