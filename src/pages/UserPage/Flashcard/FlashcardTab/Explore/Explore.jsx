import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress, Alert, Chip } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { fetchExploreFolders, cloneExploreFolder } from '../../../../../redux/explore/exploreSlice';
import { fetchFolders } from '../../../../../redux/folder/folderSlice';
import { selectCurrentUser } from '../../../../../redux/user/userSlice';
import ExploreFolderCard from './ExploreFolderCard';
import { gamify } from '../../../../../theme';
import { toast } from 'react-toastify';

export default function Explore() {
  const dispatch = useDispatch();
  const { folders, loading, error, cloningId } = useSelector((state) => state.explore);
  const currentUser = useSelector(selectCurrentUser);
  const statsLevel = useSelector((state) => state.study.stats?.level);
  const userLevel = Number(statsLevel ?? currentUser?.user?.level ?? 1);

  useEffect(() => {
    dispatch(fetchExploreFolders());
  }, [dispatch]);

  const handleClone = async (folderId) => {
    const result = await dispatch(cloneExploreFolder(folderId));
    if (cloneExploreFolder.fulfilled.match(result)) {
      toast.success('Added to your folders! 🎉');
      dispatch(fetchFolders());
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Header */}
      <Box
        sx={{
          borderRadius: 3, border: `2px solid ${gamify.gray}`, borderBottom: `4px solid ${gamify.grayDark}`,
          bgcolor: '#fff', p: { xs: 3, md: 4 }, mb: 4,
          display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' },
          justifyContent: 'space-between', gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LockOpenIcon sx={{ color: gamify.blue, fontSize: 20 }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: gamify.blue, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Explore Folders
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.3rem', color: gamify.text }}>
            Unlock & Learn
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: gamify.sub, mt: 0.5 }}>
            Level up to unlock more vocabulary sets
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: gamify.sub }}>Your level</Typography>
          <Chip
            label={`Level ${userLevel}`}
            sx={{ bgcolor: gamify.blueBg, color: gamify.blue, border: `2px solid ${gamify.blue}`, fontWeight: 900, fontSize: '0.85rem' }}
          />
        </Box>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: gamify.blue }} />
        </Box>
      )}

      {/* Error */}
      {error && !loading && (
        <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
          {typeof error === 'string' ? error : 'Failed to load folders.'}
        </Alert>
      )}

      {/* Empty */}
      {!loading && !error && folders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10, border: `2px dashed ${gamify.gray}`, borderRadius: 3 }}>
          <LockOpenIcon sx={{ fontSize: 48, color: gamify.sub, mb: 2 }} />
          <Typography sx={{ fontWeight: 700, color: gamify.sub }}>No explore folders yet</Typography>
        </Box>
      )}

      {/* Grid */}
      {!loading && folders.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2.5,
          }}
        >
          {folders.map((folder) => (
            <ExploreFolderCard
              key={folder.id}
              folder={folder}
              userLevel={userLevel}
              isCloning={cloningId === folder.id}
              onClone={handleClone}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
