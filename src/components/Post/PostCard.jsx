import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  IconButton,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import StyleIcon from '@mui/icons-material/Style';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { selectCurrentUser } from '../../redux/user/userSlice';
import {
  likePost,
  unlikePost,
  savePost,
  deletePost,
  optimisticLike,
  optimisticUnlike,
} from '../../redux/post/postSlice';
import { gamify, btn3d } from '../../theme';
import { toast } from 'react-toastify';

const actionBtn = (active, color, bgActive, border) => ({
  flex: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0.75,
  py: 1.15,
  px: 1.5,
  borderRadius: '14px',
  fontWeight: 900,
  fontSize: '0.8rem',
  textTransform: 'none',
  bgcolor: active ? bgActive : '#fff',
  color: active ? color : gamify.text,
  border: `3px solid ${active ? border : gamify.gray}`,
  borderBottom: `5px solid ${active ? border : gamify.grayDark}`,
  cursor: 'pointer',
  transition: 'all 0.12s ease',
  '&:hover': {
    bgcolor: active ? bgActive : gamify.surface,
    borderColor: border,
  },
  '&:active': {
    borderBottomWidth: 2,
    transform: 'translateY(3px)',
  },
  '&:disabled': {
    opacity: 0.55,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

export default function PostCard({ post, onPostSaved, disableFolderNavigate }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const savingPostId = useSelector((state) => state.posts.savingPostId);

  const isLoggedIn = !!currentUser?.user;
  const isOwnPost = isLoggedIn && post.user?.id === currentUser.user.id;
  const isSaving = savingPostId === post.id;

  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.info('Đăng nhập để thích bài đăng.');
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    if (post.isLiked) {
      dispatch(optimisticUnlike(post.id));
      dispatch(unlikePost(post.id));
    } else {
      dispatch(optimisticLike(post.id));
      dispatch(likePost(post.id));
    }
    setLikeLoading(false);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.info('Đăng nhập để sao chép bộ từ về thư mục của bạn.');
      return;
    }
    if (isSaving || post.isSaved) return;
    const result = await dispatch(savePost(post.id));
    if (savePost.fulfilled.match(result)) {
      toast.success('Đã sao chép bộ từ vào thư mục của bạn!');
      onPostSaved?.();
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    const result = await dispatch(deletePost(post.id));
    setDeleteLoading(false);
    if (deletePost.fulfilled.match(result)) {
      toast.success('Đã xóa bài đăng.');
      setDeleteOpen(false);
    }
  };

  const authorName = post.user?.username || post.user?.email || 'Unknown';
  const avatarLetter = authorName.charAt(0).toUpperCase();
  const cardCount = post.folder?.flashcard_count ?? 0;

  const openDetail = () => {
    if (!disableFolderNavigate) navigate(`/discover/${post.id}`);
  };

  return (
    <>
      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          borderRadius: '22px',
          border: `3px solid ${hovered ? gamify.green : gamify.gray}`,
          borderBottom: `6px solid ${hovered ? gamify.greenDark : gamify.grayDark}`,
          bgcolor: '#fff',
          color: gamify.text,
          transition: 'all 0.15s ease',
          overflow: 'hidden',
          boxShadow: hovered ? '0 12px 28px rgba(88, 204, 2, 0.12)' : '0 4px 14px rgba(0,0,0,0.06)',
        }}
      >
        {/* Author strip */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.5,
            bgcolor: gamify.surface,
            borderBottom: `2px solid ${gamify.gray}`,
          }}
        >
          <Avatar
            src={post.user?.avatar || undefined}
            alt={authorName}
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              border: `3px solid ${gamify.blueDark}`,
              bgcolor: gamify.blue,
              color: '#fff',
              fontWeight: 900,
              fontSize: '0.95rem',
            }}
          >
            {avatarLetter}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 900, fontSize: '0.92rem', lineHeight: 1.2 }}>
              {authorName}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: gamify.sub, mt: 0.25 }}>
              {new Date(post.created_at).toLocaleDateString('vi-VN')}
            </Typography>
          </Box>

          {isOwnPost && (
            <Tooltip title="Xóa bài đăng">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteOpen(true);
                }}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  border: `2px solid ${gamify.gray}`,
                  '&:hover': { bgcolor: gamify.redBg, borderColor: gamify.red },
                }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 18, color: gamify.sub }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Hero — folder (gamified / Duolingo) */}
        <Box
          component={disableFolderNavigate ? 'div' : 'button'}
          type={disableFolderNavigate ? undefined : 'button'}
          onClick={disableFolderNavigate ? undefined : openDetail}
          sx={{
            position: 'relative',
            width: '100%',
            textAlign: 'left',
            cursor: disableFolderNavigate ? 'default' : 'pointer',
            font: 'inherit',
            border: 'none',
            p: 0,
            display: 'block',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              mx: 2,
              mt: 2,
              mb: 2,
              p: 2.5,
              borderRadius: '18px',
              background: `linear-gradient(135deg, ${gamify.green} 0%, #89E219 55%, #58CC02 100%)`,
              border: `3px solid ${gamify.greenDark}`,
              borderBottom: `6px solid ${gamify.greenDark}`,
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: -30,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.15)',
              },
            }}
          >
            <Box sx={{ position: 'relative', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '16px',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  border: '3px solid rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 0 rgba(0,0,0,0.12)',
                }}
              >
                <StyleIcon sx={{ color: gamify.greenDark, fontSize: 28 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '1.05rem', sm: '1.15rem' },
                    color: '#fff',
                    lineHeight: 1.25,
                    textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                }}
                >
                  {post.folder?.title || 'Untitled Folder'}
                </Typography>
                {Array.isArray(post.folder?.tags) && post.folder.tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.25 }}>
                    {post.folder.tags.slice(0, 5).map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          bgcolor: 'rgba(255,255,255,0.95)',
                          color: gamify.greenDark,
                          border: '2px solid rgba(0,0,0,0.06)',
                        }}
                      />
                    ))}
                  </Box>
                )}
                {!disableFolderNavigate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5 }}>
                    <TouchAppIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.9)' }} />
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: 'rgba(255,255,255,0.95)' }}>
                      Chạm để xem trước thẻ và sao chép
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  flexShrink: 0,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '999px',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  border: '3px solid rgba(0,0,0,0.06)',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '0.72rem',
                    color: gamify.greenDark,
                    letterSpacing: '0.04em',
                  }}
                >
                  {cardCount} THẺ
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {post.content && (
          <Typography
            sx={{
              px: 2,
              pb: 1.5,
              fontSize: '0.9rem',
              fontWeight: 700,
              color: gamify.text,
              lineHeight: 1.55,
            }}
          >
            {post.content}
          </Typography>
        )}

        {/* Actions */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            px: 2,
            pb: 2,
            pt: post.content ? 0 : 0,
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={handleLikeToggle}
            disabled={likeLoading}
            sx={actionBtn(
              post.isLiked,
              gamify.red,
              gamify.redBg,
              gamify.redDark
            )}
          >
            {post.isLiked ? (
              <FavoriteIcon sx={{ fontSize: 20, color: gamify.red }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 20, color: gamify.sub }} />
            )}
            Thích · {post.like_count ?? 0}
          </Box>

          <Box
            component="button"
            type="button"
            onClick={handleSave}
            disabled={isSaving || post.isSaved || !isLoggedIn || isOwnPost}
            sx={actionBtn(
              post.isSaved,
              gamify.greenDark,
              gamify.greenBg,
              gamify.greenDark
            )}
          >
            {post.isSaved ? (
              <BookmarkIcon sx={{ fontSize: 20, color: gamify.greenDark }} />
            ) : (
              <BookmarkBorderIcon sx={{ fontSize: 20, color: gamify.sub }} />
            )}
            Sao chép · {post.save_count ?? 0}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={deleteOpen}
        onClose={() => !deleteLoading && setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              border: `3px solid ${gamify.gray}`,
              borderBottom: `6px solid ${gamify.grayDark}`,
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteOutlineIcon sx={{ color: gamify.red }} />
            <Typography sx={{ fontWeight: 900, color: gamify.text }}>Xóa bài đăng?</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: gamify.sub }}>
            Bài đăng sẽ bị xóa vĩnh viễn. Thao tác này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            disabled={deleteLoading}
            sx={{ borderRadius: 2, fontWeight: 900, color: gamify.sub, textTransform: 'none' }}
          >
            Huỷ
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            disabled={deleteLoading}
            sx={btn3d(gamify.red, gamify.redDark)}
          >
            {deleteLoading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
