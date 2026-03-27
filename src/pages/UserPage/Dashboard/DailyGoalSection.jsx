import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Chip, Skeleton } from '@mui/material';
import { fetchStats } from '../../../redux/study/studySlice';

function DailyGoalSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stats = useSelector((state) => state.study.stats);
  const isLoading = useSelector((state) => state.study.isLoading);
  const error = useSelector((state) => state.study.error);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="bg-white/60 backdrop-blur rounded-[2rem] border border-white/80 p-6">
        <Skeleton variant="rounded" height={80} width="100%" sx={{ borderRadius: 3 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/60 backdrop-blur rounded-[2rem] border border-white/80 p-6 flex items-center gap-4">
        <p className="text-sm text-red-500 flex-1">
          Không thể tải dữ liệu. Vui lòng thử lại.
        </p>
        <Button
          variant="outlined"
          size="small"
          onClick={() => dispatch(fetchStats())}
          sx={{ borderRadius: '999px', textTransform: 'none', fontWeight: 600 }}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur rounded-[2rem] border border-white/80 p-6 flex items-center justify-between gap-4 flex-wrap">
      {stats?.due > 0 ? (
        <Button
          variant="contained"
          onClick={() => navigate('/study')}
          sx={{
            backgroundColor: '#4F46E5',
            borderRadius: '999px',
            fontWeight: 700,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#4338CA' },
          }}
        >
          Học ngay — {stats.due} thẻ chờ
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={() => navigate('/flashcard/folders')}
          sx={{
            backgroundColor: '#4F46E5',
            borderRadius: '999px',
            fontWeight: 700,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#4338CA' },
          }}
        >
          🎉 Bạn đã hoàn thành rồi! Thêm thẻ mới
        </Button>
      )}

      <Chip
        label={`📚 ${stats?.reviewedToday ?? 0} đã ôn hôm nay`}
        size="small"
        sx={{
          borderRadius: '999px',
          backgroundColor: 'rgba(0,0,0,0.06)',
          color: '#64748b',
          fontWeight: 500,
          fontSize: '0.75rem',
        }}
      />
    </div>
  );
}

export default DailyGoalSection;
