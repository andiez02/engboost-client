import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StyleIcon from '@mui/icons-material/Style';
import Sidebar from '../../../components/Layout/SideBar';
import HeaderUser from '../../../components/Layout/HeaderUser';
import PostCard from '../../../components/Post/PostCard';
import { gamify, tokens } from '../../../theme';
import { postService } from '../../../services/post/post.service';
import { routes } from '../../../utils/constants';

export default function DiscoverPostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [previewFlashcards, setPreviewFlashcards] = useState([]);

  const feedPost = useSelector((s) => s.posts.posts.find((p) => p.id === postId));
  const displayPost = useMemo(() => {
    if (!post) return null;
    if (!feedPost) return post;
    return {
      ...post,
      isLiked: feedPost.isLiked,
      like_count: feedPost.like_count,
      isSaved: feedPost.isSaved,
      save_count: feedPost.save_count,
    };
  }, [post, feedPost]);

  const handleSidebarToggle = (val) => {
    setIsSidebarOpen(val);
    localStorage.setItem('sidebarOpen', String(val));
  };

  const load = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await postService.getPostById(postId);
      if (!res?.success || !res.data?.post) {
        setError('Không tìm thấy bài đăng.');
        setPost(null);
        setPreviewFlashcards([]);
        return;
      }
      setPost(res.data.post);
      setPreviewFlashcards(res.data.previewFlashcards || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Không tải được bài đăng.');
      setPost(null);
      setPreviewFlashcards([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePostSaved = useCallback(() => {
    load();
  }, [load]);

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: `linear-gradient(165deg, ${gamify.greenBg} 0%, #E8FCD9 18%, #FFF9E6 45%, #FAFAFA 100%)`,
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

        <Box sx={{ mt: '60px', maxWidth: 720, mx: 'auto', pb: 10 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(routes.DISCOVER)}
            sx={{
              mb: 2,
              fontWeight: 900,
              color: gamify.text,
              textTransform: 'none',
              borderRadius: '14px',
              border: `3px solid ${gamify.gray}`,
              borderBottom: `5px solid ${gamify.grayDark}`,
              px: 2,
              py: 1,
              bgcolor: '#fff',
              '&:hover': { bgcolor: gamify.greenBg, borderColor: gamify.green },
            }}
          >
            Quay lại Discover
          </Button>

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
              {typeof error === 'string' ? error : 'Đã xảy ra lỗi.'}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress size={48} thickness={4} sx={{ color: gamify.green }} />
            </Box>
          )}

          {!loading && displayPost && (
            <>
              <Box
                sx={{
                  mb: 2.5,
                  p: 2,
                  borderRadius: '20px',
                  border: `3px solid ${gamify.gray}`,
                  borderBottom: `6px solid ${gamify.grayDark}`,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  boxShadow: tokens.shadow.sm,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '14px',
                      background: `linear-gradient(145deg, ${gamify.green} 0%, #89E219 100%)`,
                      border: `3px solid ${gamify.greenDark}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <StyleIcon sx={{ color: '#fff', fontSize: 26 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', color: gamify.text }}>
                      Xem trước thẻ
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: gamify.sub }}>
                      Tối đa 8 thẻ đầu trong folder
                    </Typography>
                  </Box>
                </Box>

                {previewFlashcards.length > 0 ? (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 1.5,
                    }}
                  >
                    {previewFlashcards.map((fc) => (
                      <Box
                        key={fc.id}
                        sx={{
                          p: 1.75,
                          borderRadius: '16px',
                          border: `3px solid ${gamify.gray}`,
                          borderBottom: `5px solid ${gamify.grayDark}`,
                          bgcolor: '#fff',
                          overflow: 'hidden',
                        }}
                      >
                        {fc.image_url && String(fc.image_url).trim() !== '' && (
                          <Box
                            component="img"
                            src={fc.image_url}
                            alt=""
                            loading="lazy"
                            sx={{
                              display: 'block',
                              width: '100%',
                              height: 120,
                              objectFit: 'cover',
                              borderRadius: '12px',
                              mb: 1.25,
                              border: `2px solid ${gamify.gray}`,
                              bgcolor: gamify.surface,
                            }}
                          />
                        )}
                        <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', color: gamify.text }}>
                          {fc.english}
                        </Typography>
                        {fc.vietnamese && (
                          <Typography sx={{ fontSize: '0.85rem', color: gamify.sub, mt: 0.5, fontWeight: 600 }}>
                            {fc.vietnamese}
                          </Typography>
                        )}
                        {fc.pos && (
                          <Chip
                            label={fc.pos}
                            size="small"
                            sx={{
                              mt: 1,
                              height: 24,
                              fontSize: '0.65rem',
                              fontWeight: 900,
                              bgcolor: gamify.greenBg,
                              color: gamify.greenDark,
                              border: `2px solid ${gamify.green}`,
                            }}
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: gamify.sub, fontSize: '0.9rem', fontWeight: 600 }}>
                    Chưa có thẻ trong folder này.
                  </Typography>
                )}
              </Box>

              <PostCard post={displayPost} onPostSaved={handlePostSaved} disableFolderNavigate />
            </>
          )}
        </Box>
      </div>
    </div>
  );
}
