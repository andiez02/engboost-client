import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FolderIcon from '@mui/icons-material/Folder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SchoolIcon from '@mui/icons-material/School';
import { routes } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {  } from '../../redux/folder/folderSlice';
import { colors } from '../../theme';
import { Typography, Box, Chip } from '@mui/material';

function UserFlashcardOverview() {
  const navigate = useNavigate();
  const { folders } = useSelector((state) => state.folders);

  const totalFlashcards = folders?.reduce(
    (acc, folder) => acc + (folder.flashcard_count || 0),
    0
  );

  const handleFolderClick = () => {
    navigate(routes.FLASHCARD_FOLDERS);
  };

  const handleViewAll = () => {
    navigate(routes.FLASHCARD_FOLDERS);
  };

  const displayedFolders = folders?.slice(0, 3);

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 700, color: colors.dark }}>
          Flashcard của tôi
        </Typography>
      </Box>
      <div
        className='w-full h-auto min-h-[160px] mt-4 rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-500'
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          border: `1px solid rgba(255, 255, 255, 0.8)`,
          boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
        }}
      >
        <div>
          <Typography
            variant='body1'
            sx={{ color: `${colors.dark}B3`, fontWeight: 500, mb: 4, lineHeight: 1.6 }}
          >
            {folders?.length === 0
              ? 'Bạn chưa học list từ nào. Khám phá ngay hoặc bắt đầu tạo các list từ mới.'
              : `Bạn đã có ${folders?.length} thư mục với tổng cộng ${totalFlashcards} từ vựng.`}
          </Typography>
          {folders?.length > 0 && (
            <div className='mt-2'>
              <div className='flex items-center justify-between mb-4'>
                <Typography variant='caption' sx={{ fontWeight: 700, color: `${colors.dark}80`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Danh sách thư mục
                </Typography>
                <Typography variant='caption' sx={{ fontWeight: 600, color: `${colors.dark}80` }}>
                  {folders?.length} thư mục
                </Typography>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {displayedFolders.map((folder) => (
                  <div
                    key={`${folder.id}-${folder.title}`}
                    onClick={() => handleFolderClick(folder.id)}
                    className='bg-white/40 group px-5 py-4 rounded-2xl text-sm transition-all duration-300 flex items-center gap-4 border border-white/60 hover:border-blue hover:bg-white/80 cursor-pointer shadow-sm hover:shadow-lg'
                  >
                    <div className='w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center group-hover:bg-blue/20 transition-colors'>
                      <FolderIcon sx={{ color: colors.blue, fontSize: 20 }} />
                    </div>
                    <div className='flex-1 overflow-hidden'>
                      <Typography
                        variant='body1'
                        sx={{ fontWeight: 700, color: colors.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {folder.title}
                      </Typography>
                      <Typography variant='caption' sx={{ color: `${colors.dark}80`, fontWeight: 600 }}>
                        {folder.flashcard_count || 0} từ vựng
                      </Typography>
                    </div>
                  </div>
                ))}
                {folders?.length > 3 && (
                  <div
                    onClick={handleViewAll}
                    className='bg-white/40 group px-5 py-4 rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-3 border border-white/60 hover:border-rose hover:bg-white/80 cursor-pointer shadow-sm hover:shadow-lg'
                  >
                    <div className='w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center group-hover:bg-rose/20 transition-colors'>
                      <MoreHorizIcon sx={{ color: colors.rose, fontSize: 20 }} />
                    </div>
                    <Typography variant='body1' sx={{ fontWeight: 700, color: colors.dark }}>
                      Xem tất cả
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {folders?.length === 0 && (
          <Button
            variant='contained'
            endIcon={<ArrowForwardIcon />}
            sx={{
              alignSelf: 'start',
              borderRadius: '50rem',
              px: 4,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: colors.blue,
              boxShadow: `0 8px 20px ${colors.blue}33`,
              mt: 2,
              '&:hover': {
                bgcolor: colors.blue,
                boxShadow: `0 12px 25px ${colors.blue}4D`,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s',
            }}
            onClick={() => navigate(routes.FLASHCARD_SNAPLANG)}
          >
            Khám phá ngay
          </Button>
        )}
      </div>
    </div>
  );
}

export default UserFlashcardOverview;
