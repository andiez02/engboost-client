import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import { fetchPosts, resetFeed } from '../../../redux/post/postSlice';
import PostCard from '../../../components/Post/PostCard';
import Sidebar from '../../../components/Layout/SideBar';
import HeaderUser from '../../../components/Layout/HeaderUser';
import { gamify, btn3d } from '../../../theme';

export default function DiscoverPage() {
  const dispatch = useDispatch();
  const { posts, nextCursor, hasMore, loading, loadingMore, error } = useSelector(
    (state) => state.posts
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });

  const handleSidebarToggle = (val) => {
    setIsSidebarOpen(val);
    localStorage.setItem('sidebarOpen', String(val));
  };

  // Initial load
  useEffect(() => {
    dispatch(resetFeed());
    dispatch(fetchPosts({ limit: 10 }));
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    dispatch(fetchPosts({ limit: 10, cursor: nextCursor }));
  }, [dispatch, loadingMore, hasMore, nextCursor]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarToggle} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-58' : 'ml-20'
        } p-6 lg:p-8`}
      >
        <HeaderUser
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={handleSidebarToggle}
        />

        <Box sx={{ mt: '60px', maxWidth: 680, mx: 'auto', pb: 8 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, pt: 2 }}>
            <ExploreIcon sx={{ color: gamify.blue, fontSize: 32 }} />
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: gamify.text }}>
                Discover
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: gamify.sub }}>
                Explore vocabulary sets shared by the community
              </Typography>
            </Box>
          </Box>

          {/* Error state */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {typeof error === 'string' ? error : 'Failed to load posts.'}
            </Alert>
          )}

          {/* Initial loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: gamify.blue }} />
            </Box>
          )}

          {/* Empty state */}
          {!loading && posts.length === 0 && !error && (
            <Box
              sx={{
                textAlign: 'center',
                py: 10,
                border: `2px dashed ${gamify.gray}`,
                borderRadius: 3,
              }}
            >
              <ExploreIcon sx={{ fontSize: 48, color: gamify.sub, mb: 2 }} />
              <Typography sx={{ fontWeight: 700, color: gamify.sub }}>
                No posts yet
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: gamify.sub, mt: 0.5 }}>
                Be the first to share a folder!
              </Typography>
            </Box>
          )}

          {/* Post list */}
          {!loading && posts.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Box>
          )}

          {/* Load more */}
          {!loading && hasMore && posts.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleLoadMore}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={16} color="inherit" /> : null}
                sx={btn3d(gamify.blue, gamify.blueDark)}
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </Box>
          )}

          {/* End of feed */}
          {!loading && !hasMore && posts.length > 0 && (
            <Typography
              sx={{ textAlign: 'center', color: gamify.sub, fontSize: '0.85rem', mt: 4 }}
            >
              You've reached the end
            </Typography>
          )}
        </Box>
      </div>
    </div>
  );
}
