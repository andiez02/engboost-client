import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, Skeleton, Typography } from '@mui/material';

export default function FolderGrid({ folders = [], isLoading }) {
  const navigate = useNavigate();

  const sortedFolders = useMemo(() => {
    return [...folders].sort((firstFolder, secondFolder) => {
      const firstDueCount = firstFolder.due_count ?? 0;
      const secondDueCount = secondFolder.due_count ?? 0;
      return secondDueCount - firstDueCount;
    });
  }, [folders]);

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.25,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography fontSize="1.2rem">📚</Typography>
            <Typography fontSize="0.85rem" fontWeight={900} color="#AFAFAF" sx={{ letterSpacing: '0.05em' }}>
              BỘ THẺ TỪ VỰNG
            </Typography>
          </Box>
          <Typography fontWeight={900} fontSize="1.3rem" sx={{ mt: 0.5, color: '#4B4B4B', letterSpacing: '-0.02em' }}>
            Chọn bộ để học tiếp
          </Typography>
        </Box>

        <ButtonBase
          onClick={() => navigate('/flashcard/folders')}
          sx={{
            px: 2.4,
            py: 1.2,
            borderRadius: 4,
            bgcolor: '#E5E5E5',
            color: '#8A8A8A',
            fontWeight: 900,
            fontSize: '0.9rem',
            borderBottom: '4px solid #D1D5DB',
            transition: 'all 0.1s ease',
            '&:hover': {
              bgcolor: '#D1D5DB',
              color: '#4B4B4B',
            },
            '&:active': {
              borderBottomWidth: '0px',
              transform: 'translateY(4px)',
              mb: '4px',
            },
          }}
        >
          QUẢN LÝ BỘ
        </ButtonBase>
      </Box>

      {isLoading ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
            gap: 2,
          }}
        >
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} variant="rounded" height={188} sx={{ borderRadius: 4 }} />
          ))}
        </Box>
      ) : sortedFolders.length === 0 ? (
        <Box
          sx={{
            borderRadius: 4,
            border: '2px dashed #E5E5E5',
            bgcolor: '#FAFAFA',
            px: 3,
            py: 4,
            textAlign: 'center',
          }}
        >
          <Typography fontSize="2.5rem">📚</Typography>
          <Typography fontWeight={900} fontSize="1.2rem" sx={{ mt: 1, color: '#4B4B4B' }}>
            Chưa có bộ thẻ nào
          </Typography>
          <Typography color="text.secondary" fontWeight={700} fontSize="0.95rem" sx={{ mt: 0.5 }}>
            Tạo bộ mới và bắt đầu ghi điểm ngay hôm nay!
          </Typography>
          <ButtonBase
            onClick={() => navigate('/flashcard/folders')}
            sx={{
              mt: 2.5,
              px: 3.5,
              py: 1.5,
              borderRadius: 4,
              bgcolor: '#1CB0F6',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1rem',
              borderBottom: '4px solid #1899D6',
              transition: 'all 0.1s ease',
              '&:active': {
                borderBottomWidth: '0px',
                transform: 'translateY(4px)',
              },
            }}
          >
            TẠO BỘ ĐẦU TIÊN
          </ButtonBase>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
            gap: 2,
          }}
        >
          {sortedFolders.map((folder) => {
            const folderId = folder._id ?? folder.id;
            const dueCount = folder.due_count ?? 0;
            const totalCards = folder.flashcard_count ?? 0;
            const isPriority = dueCount > 0;

            const cardBorderColor = isPriority ? '#FF9600' : '#E5E5E5';
            const cardBorderBottom = isPriority ? '#D87A00' : '#E5E5E5';
            const cardBg = isPriority ? 'rgba(255, 150, 0, 0.05)' : '#fff';

            return (
              <Box
                key={folderId}
                sx={{
                  borderRadius: 4,
                  p: 2.2,
                  bgcolor: cardBg,
                  border: `2px solid ${cardBorderColor}`,
                  borderBottom: `4px solid ${cardBorderBottom}`,
                  transition: 'transform 0.1s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      fontWeight={900}
                      fontSize="1.1rem"
                      color="#4B4B4B"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {folder.title}
                    </Typography>
                    <Typography fontWeight={700} fontSize="0.85rem" color="text.secondary" sx={{ mt: 0.4 }}>
                      {isPriority ? 'Sẵn sàng ôn' : 'Hàng ôn đang trống'}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flexShrink: 0,
                      px: 1.2,
                      py: 0.65,
                      borderRadius: 4,
                      bgcolor: isPriority ? '#FF9600' : '#E5E5E5',
                      color: isPriority ? '#fff' : '#AFAFAF',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {isPriority ? 'NÓNG' : 'NHÀN'}
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gap: 1, mt: 2 }}>
                  <Typography fontWeight={900} fontSize="0.95rem" color={isPriority ? '#FF9600' : '#AFAFAF'}>
                    🔥 {dueCount} THẺ CHỜ
                  </Typography>
                  <Typography fontWeight={900} fontSize="0.95rem" color="#AFAFAF">
                    📦 {totalCards} TỔNG
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.2, mt: 2.4 }}>
                  <ButtonBase
                    onClick={() => navigate(`/study?folderId=${folderId}`)}
                    disabled={totalCards === 0}
                    sx={{
                      flex: 1,
                      px: 2.4,
                      py: 1.4,
                      borderRadius: 4,
                      bgcolor: isPriority ? '#58CC02' : '#1CB0F6',
                      color: '#fff',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      opacity: totalCards === 0 ? 0.5 : 1,
                      borderBottom: totalCards === 0 
                        ? (isPriority ? '4px solid #46A302' : '4px solid #1899D6')
                        : (isPriority ? '4px solid #46A302' : '4px solid #1899D6'),
                      transition: 'all 0.1s ease',
                      '&:active': totalCards === 0 ? {} : {
                        borderBottomWidth: '0px',
                        transform: 'translateY(4px)',
                        mb: '4px',
                      },
                    }}
                  >
                    HỌC
                  </ButtonBase>

                  <ButtonBase
                    onClick={() => navigate('/flashcard/folders')}
                    sx={{
                      flex: 1,
                      px: 2.4,
                      py: 1.4,
                      borderRadius: 4,
                      bgcolor: '#fff',
                      color: '#AFAFAF',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      border: '2px solid #E5E5E5',
                      borderBottom: '4px solid #E5E5E5',
                      transition: 'all 0.1s ease',
                      '&:active': {
                        borderBottomWidth: '2px', // half push down
                        transform: 'translateY(2px)',
                        mb: '2px',
                      },
                    }}
                  >
                    XEM
                  </ButtonBase>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
