import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, IconButton, Box, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import StyleIcon from '@mui/icons-material/Style';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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

export default function PostCard({ post }) {
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

  const handleLikeToggle = async () => {
    if (!isLoggedIn) { toast.info('Please log in to like posts.'); return; }
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

  const handleSave = async () => {
    if (!isLoggedIn) { toast.info('Please log in to save posts.'); return; }
    if (isSaving || post.isSaved) return;
    const result = await dispatch(savePost(post.id));
    if (savePost.fulfilled.match(result)) {
      toast.success('Saved to your folders!');
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    const result = await dispatch(deletePost(post.id));
    setDeleteLoading(false);
    if (deletePost.fulfilled.match(result)) {
      toast.success('Post deleted.');
      setDeleteOpen(false);
    }
  };

  const authorName = post.user?.username || post.user?.email || 'Unknown';
  const avatarLetter = authorName.charAt(0).toUpperCase();

  return (
    <>
      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          borderRadius: '16px',
          border: `2px solid ${hovered ? gamify.blue : gamify.gray}`,
          borderBottom: `4px solid ${hovered ? gamify.blueDark : gamify.grayDark}`,
          bgcolor: hovered ? '#F2FCFF' : '#fff',
          transition: 'all 0.15s ease',
          p: 2.5,
          cursor: 'default',
        }}
      >
        {/* Author row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 38, height: 38,
              borderRadius: '50%',
              bgcolor: gamify.blue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${gamify.blueDark}`,
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontWeight: 900, fontSize: '0.85rem', color: '#fff', lineHeight: 1 }}>
              {avatarLetter}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: gamify.text, lineHeight: 1.2 }}>
              {authorName}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: gamify.sub, mt: 0.25 }}>
              {new Date(post.created_at).toLocaleDateString()}
            </Typography>
          </Box>

          {isOwnPost && (
            <Tooltip title="Delete post">
              <IconButton
                size="small"
                onClick={() => setDeleteOpen(true)}
                sx={{
                  width: 32, height: 32,
                  borderRadius: '10px',
                  color: gamify.sub,
                  border: `2px solid transparent`,
                  transition: 'all 0.15s',
                  '&:hover': {
                    color: gamify.red,
                    bgcolor: gamify.redBg,
                    borderColor: `${gamify.red}33`,
                  },
                }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Folder card */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: post.content ? 1.5 : 0,
            p: 1.5,
            borderRadius: '12px',
            bgcolor: gamify.blueBg,
            border: `1.5px solid ${gamify.blue}22`,
          }}
        >
          <Box
            sx={{
              width: 36, height: 36,
              borderRadius: '10px',
              bgcolor: '#fff',
              border: `2px solid ${gamify.blue}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <StyleIcon sx={{ color: gamify.blue, fontSize: 18 }} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{
              fontWeight: 900,
              fontSize: '0.9rem',
              color: gamify.text,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {post.folder?.title || 'Untitled Folder'}
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1.25,
              py: 0.4,
              borderRadius: '8px',
              bgcolor: gamify.blue,
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontWeight: 900, fontSize: '0.65rem', color: '#fff', letterSpacing: '0.04em' }}>
              {post.folder?.flashcard_count ?? 0} CARDS
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        {post.content && (
          <Typography sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: gamify.text,
            lineHeight: 1.6,
            mt: 1.5,
            mb: 0.5,
          }}>
            {post.content}
          </Typography>
        )}

        {/* Actions row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, pt: 1.5, borderTop: `2px solid ${gamify.gray}` }}>
          {/* Like */}
          <Tooltip title={isLoggedIn ? (post.isLiked ? 'Unlike' : 'Like') : 'Log in to like'}>
            <span>
              <Box
                component="button"
                onClick={handleLikeToggle}
                disabled={likeLoading}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  border: `2px solid ${post.isLiked ? `${gamify.red}33` : gamify.gray}`,
                  borderRadius: '10px',
                  bgcolor: post.isLiked ? gamify.redBg : '#fff',
                  px: 1.25,
                  py: 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': {
                    borderColor: `${gamify.red}55`,
                    bgcolor: gamify.redBg,
                  },
                  '&:disabled': { opacity: 0.6, cursor: 'default' },
                }}
              >
                {post.isLiked
                  ? <FavoriteIcon sx={{ fontSize: 16, color: gamify.red }} />
                  : <FavoriteBorderIcon sx={{ fontSize: 16, color: gamify.sub }} />}
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: post.isLiked ? gamify.red : gamify.sub }}>
                  {post.like_count ?? 0}
                </Typography>
              </Box>
            </span>
          </Tooltip>

          {/* Save */}
          <Tooltip title={!isLoggedIn ? 'Log in to save' : isOwnPost ? "Can't save your own post" : post.isSaved ? 'Already saved' : 'Save to my folders'}>
            <span>
              <Box
                component="button"
                onClick={handleSave}
                disabled={isSaving || post.isSaved || !isLoggedIn || isOwnPost}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  border: `2px solid ${post.isSaved ? `${gamify.green}33` : gamify.gray}`,
                  borderRadius: '10px',
                  bgcolor: post.isSaved ? gamify.greenBg : '#fff',
                  px: 1.25,
                  py: 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': {
                    borderColor: `${gamify.green}55`,
                    bgcolor: gamify.greenBg,
                  },
                  '&:disabled': { opacity: 0.6, cursor: 'default' },
                }}
              >
                {post.isSaved
                  ? <BookmarkIcon sx={{ fontSize: 16, color: gamify.green }} />
                  : <BookmarkBorderIcon sx={{ fontSize: 16, color: gamify.sub }} />}
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: post.isSaved ? gamify.green : gamify.sub }}>
                  {post.save_count ?? 0}
                </Typography>
              </Box>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Delete confirmation */}
      <Dialog
        open={deleteOpen}
        onClose={() => !deleteLoading && setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              border: `2px solid ${gamify.gray}`,
              borderBottom: `4px solid ${gamify.grayDark}`,
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteOutlineIcon sx={{ color: gamify.red }} />
            <Typography sx={{ fontWeight: 900, color: gamify.text }}>Delete Post?</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: gamify.sub }}>
            This post will be permanently deleted. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            disabled={deleteLoading}
            sx={{ borderRadius: 2, fontWeight: 800, color: gamify.sub, textTransform: 'uppercase', fontSize: '0.8rem' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            disabled={deleteLoading}
            sx={btn3d(gamify.red, gamify.redDark)}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
