import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SearchIcon from '@mui/icons-material/Search';
import { fetchPosts, resetFeed } from '../../../redux/post/postSlice';
import PostCard from '../../../components/Post/PostCard';
import Sidebar from '../../../components/Layout/SideBar';
import HeaderUser from '../../../components/Layout/HeaderUser';
import { gamify, btn3d, tokens } from '../../../theme';

export default function DiscoverPage() {
  const dispatch = useDispatch();
  const { posts, nextCursor, nextOffset, hasMore, loading, loadingMore, error } = useSelector(
    (state) => state.posts
  );

  const [sort, setSort] = useState('newest');
  const [tagInput, setTagInput] = useState('');
  const [appliedTag, setAppliedTag] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });

  const handleSidebarToggle = (val) => {
    setIsSidebarOpen(val);
    localStorage.setItem('sidebarOpen', String(val));
  };

  useEffect(() => {
    dispatch(resetFeed());
    dispatch(
      fetchPosts({
        limit: 10,
        sort,
        tag: appliedTag || undefined,
      })
    );
  }, [dispatch, sort, appliedTag]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    if (sort === 'trending') {
      if (nextOffset == null) return;
      dispatch(
        fetchPosts({
          limit: 10,
          sort: 'trending',
          tag: appliedTag || undefined,
          offset: nextOffset,
        })
      );
    } else {
      dispatch(
        fetchPosts({
          limit: 10,
          cursor: nextCursor,
          sort: 'newest',
          tag: appliedTag || undefined,
        })
      );
    }
  }, [dispatch, loadingMore, hasMore, nextCursor, nextOffset, sort, appliedTag]);

  const handleApplyTag = () => {
    setAppliedTag(tagInput.trim());
  };

  const sortPill = (active) => ({
    flex: 1,
    py: 1.25,
    px: 2,
    borderRadius: '999px',
    fontWeight: 900,
    fontSize: '0.85rem',
    textTransform: 'none',
    border: '3px solid',
    transition: 'all 0.15s ease',
    ...(active
      ? {
          bgcolor: gamify.green,
          color: '#fff',
          borderColor: gamify.greenDark,
          borderBottomWidth: 5,
          boxShadow: `inset 0 -2px 0 rgba(0,0,0,0.12)`,
        }
      : {
          bgcolor: '#fff',
          color: gamify.text,
          borderColor: gamify.gray,
          borderBottomWidth: 4,
          '&:hover': { bgcolor: gamify.greenBg, borderColor: gamify.green },
        }),
  });

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: `linear-gradient(165deg, ${gamify.greenBg} 0%, #E8FCD9 18%, #FFF9E6 42%, #FAFAFA 72%, #F5F5F5 100%)`,
      }}
    >
      <Sidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarToggle} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-58' : 'ml-20'
        } p-4 sm:p-6 lg:p-8`}
      >
        <HeaderUser
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={handleSidebarToggle}
        />

        <Box sx={{ mt: '60px', maxWidth: 720, mx: 'auto', pb: 10, px: { xs: 0, sm: 1 } }}>
          {/* Hero header — Duolingo / gamified */}
          <Box
            sx={{
              position: 'relative',
              mb: 3,
              p: { xs: 2.5, sm: 3 },
              borderRadius: '24px',
              border: `3px solid ${gamify.gray}`,
              borderBottom: `6px solid ${gamify.grayDark}`,
              bgcolor: 'rgba(255,255,255,0.92)',
              boxShadow: tokens.shadow.md,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -40,
                right: -30,
                width: 140,
                height: 140,
                borderRadius: '50%',
                bgcolor: `${gamify.green}22`,
                pointerEvents: 'none',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -20,
                left: -20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: `${tokens.color.warning}18`,
                pointerEvents: 'none',
              }}
            />
            <Box sx={{ position: 'relative', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '18px',
                  background: `linear-gradient(145deg, ${gamify.green} 0%, #89E219 100%)`,
                  border: `3px solid ${gamify.greenDark}`,
                  borderBottomWidth: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 0 rgba(0,0,0,0.15)',
                }}
              >
                <AutoAwesomeIcon sx={{ color: '#fff', fontSize: 30 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '1.65rem', sm: '1.85rem' },
                    color: gamify.text,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                  }}
                >
                  Discover
                </Typography>
                <Typography
                  sx={{
                    mt: 0.75,
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: gamify.sub,
                    lineHeight: 1.45,
                    maxWidth: 520,
                  }}
                >
                  Săn bộ từ hay từ cộng đồng —{' '}
                  <Box component="span" sx={{ color: gamify.greenDark, fontWeight: 900 }}>
                    sao chép một chạm
                  </Box>{' '}
                  rồi ôn ngay trong Flashcard.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Filters */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: '20px',
              border: `3px solid ${gamify.gray}`,
              borderBottom: `5px solid ${gamify.grayDark}`,
              bgcolor: '#fff',
            }}
          >
            <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: gamify.sub, mb: 1.5, letterSpacing: '0.06em' }}>
              SẮP XẾP
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
              <Button
                disableElevation
                onClick={() => setSort('newest')}
                sx={sortPill(sort === 'newest')}
              >
                Mới nhất
              </Button>
              <Button
                disableElevation
                onClick={() => setSort('trending')}
                sx={sortPill(sort === 'trending')}
              >
                Nổi bật
              </Button>
            </Box>

            <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: gamify.sub, mb: 1.5, letterSpacing: '0.06em' }}>
              LỌC TAG
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'stretch' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="vd: IELTS, TOEIC..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyTag()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: gamify.greenDark, fontSize: 22 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  maxWidth: 420,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    fontWeight: 700,
                    bgcolor: gamify.surface,
                    '& fieldset': { borderWidth: 3, borderColor: gamify.gray },
                    '&:hover fieldset': { borderColor: gamify.green },
                    '&.Mui-focused fieldset': { borderColor: gamify.greenDark, borderWidth: 3 },
                  },
                }}
              />
              <Button
                onClick={handleApplyTag}
                sx={{
                  ...btn3d(gamify.green, gamify.greenDark),
                  px: 3,
                  minWidth: 120,
                }}
              >
                Áp dụng
              </Button>
              {appliedTag && (
                <Button
                  onClick={() => {
                    setTagInput('');
                    setAppliedTag('');
                  }}
                  sx={{
                    fontWeight: 900,
                    color: gamify.sub,
                    textTransform: 'none',
                    borderRadius: '14px',
                    border: `3px solid ${gamify.gray}`,
                    px: 2,
                  }}
                >
                  Xóa lọc
                </Button>
              )}
            </Box>
            {appliedTag && (
              <Box
                sx={{
                  mt: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: '999px',
                  bgcolor: gamify.greenBg,
                  border: `2px solid ${gamify.green}`,
                }}
              >
                <Typography sx={{ fontWeight: 900, fontSize: '0.8rem', color: gamify.greenDark }}>
                  #{appliedTag}
                </Typography>
              </Box>
            )}
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '16px',
                border: `3px solid ${gamify.red}`,
                fontWeight: 700,
              }}
            >
              {typeof error === 'string' ? error : 'Không tải được bài đăng.'}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress
                size={48}
                thickness={4}
                sx={{ color: gamify.green }}
              />
            </Box>
          )}

          {!loading && posts.length === 0 && !error && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 2,
                borderRadius: '24px',
                border: `3px dashed ${gamify.gray}`,
                borderBottom: `6px dashed ${gamify.grayDark}`,
                bgcolor: 'rgba(255,255,255,0.7)',
              }}
            >
              <Typography sx={{ fontSize: '3rem', lineHeight: 1, mb: 2 }}>
                📭
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: gamify.text }}>
                Chưa có bài đăng
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: gamify.sub, mt: 1, fontWeight: 600 }}>
                Mở Flashcard → chọn folder → &quot;Chia sẻ lên Discover&quot; để là người đầu tiên!
              </Typography>
            </Box>
          )}

          {!loading && posts.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Box>
          )}

          {!loading && hasMore && posts.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Button
                variant="contained"
                onClick={handleLoadMore}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : null}
                sx={{
                  ...btn3d(tokens.color.accentVia, '#5B21B6'),
                  px: 4,
                  py: 1.25,
                  fontSize: '0.9rem',
                }}
              >
                {loadingMore ? 'Đang tải...' : 'Tải thêm bài'}
              </Button>
            </Box>
          )}

          {!loading && !hasMore && posts.length > 0 && (
            <Box
              sx={{
                textAlign: 'center',
                mt: 4,
                py: 2,
                borderRadius: '16px',
                bgcolor: 'rgba(255,255,255,0.6)',
              }}
            >
              <Typography sx={{ fontWeight: 800, color: gamify.sub, fontSize: '0.9rem' }}>
                Bạn đã xem hết — quay lại sau nhé!
              </Typography>
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
}
