import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Skeleton } from '@mui/material';
import Sidebar from '../../../components/Layout/SideBar';
import HeaderUser from '../../../components/Layout/HeaderUser';
import ChallengeCard from './ChallengeCard';
import { fetchStats } from '../../../redux/study/studySlice';

export default function ChallengePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();

  const { challenges, isLoading, error } = useSelector((state) => state.challenges);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-58' : 'ml-20'
        } p-6 lg:p-8`}
      >
        <HeaderUser isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <div className="min-h-screen mt-[60px] pb-10 flex justify-center">
          <Box sx={{ width: '100%', maxWidth: 800, mt: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography fontSize="2.5rem" sx={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                🎯
              </Typography>
              <Typography fontWeight={900} fontSize="2rem" color="#4B4B4B">
                Thử Thách Hàng Ngày
              </Typography>
            </Box>

            {/* List */}
            {isLoading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Skeleton variant="rounded" height={140} sx={{ borderRadius: 4 }} />
                <Skeleton variant="rounded" height={140} sx={{ borderRadius: 4 }} />
                <Skeleton variant="rounded" height={140} sx={{ borderRadius: 4 }} />
              </Box>
            ) : error ? (
              <Box
                sx={{
                  bgcolor: '#FFF0F0',
                  color: '#FF4B4B',
                  p: 3,
                  borderRadius: 4,
                  textAlign: 'center',
                  fontWeight: 700,
                  border: '2px solid #FFCDCD',
                }}
              >
                {error}
              </Box>
            ) : challenges.length === 0 ? (
              <Box
                sx={{
                  bgcolor: '#fff',
                  border: '2px solid #E5E5E5',
                  borderBottom: '4px solid #E5E5E5',
                  borderRadius: 4,
                  p: 6,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography fontSize="3rem" color="#AFAFAF">
                  💤
                </Typography>
                <Typography fontWeight={800} fontSize="1.2rem" color="#AFAFAF">
                  Không có thử thách nào khả dụng hôm nay
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {challenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </Box>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}
