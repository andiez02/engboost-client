import { Box, Typography, Chip, Button, CircularProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import StyleIcon from '@mui/icons-material/Style';
import AddIcon from '@mui/icons-material/Add';
import { gamify, btn3d } from '../../../../../theme';

export default function ExploreFolderCard({ folder, onClone, isCloning, userLevel }) {
  const requiredLevel = Number(folder.required_level ?? 1);
  const locked = userLevel < requiredLevel;

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 3,
        border: `2px solid ${locked ? gamify.gray : gamify.blue}`,
        borderBottom: `4px solid ${locked ? gamify.grayDark : gamify.blueDark}`,
        bgcolor: locked ? gamify.surface : '#fff',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        transition: 'all 0.2s',
        opacity: locked ? 0.75 : 1,
        '&:hover': locked ? {} : {
          borderColor: gamify.blue,
          boxShadow: '0 4px 16px rgba(28,176,246,0.12)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Lock overlay */}
      {locked && (
        <Box
          sx={{
            position: 'absolute', inset: 0, borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(2px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', zIndex: 2, gap: 0.5,
          }}
        >
          <LockIcon sx={{ color: gamify.sub, fontSize: 28 }} />
          <Typography sx={{ fontWeight: 900, fontSize: '0.8rem', color: gamify.sub }}>
            Unlock at level {requiredLevel} 🔒
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: gamify.sub }}>
            You are level {userLevel}
          </Typography>
        </Box>
      )}

      {/* Folder icon + title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: gamify.blueBg, border: `2px solid ${gamify.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <StyleIcon sx={{ color: gamify.blue, fontSize: 22 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: gamify.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {folder.title}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: gamify.sub }}>
            {folder.flashcard_count} cards
          </Typography>
        </Box>
      </Box>

      {/* Level chip */}
      <Chip
        label={`Level ${requiredLevel}+`}
        size="small"
        sx={{
          alignSelf: 'flex-start',
          bgcolor: locked ? gamify.surface : gamify.blueBg,
          color: locked ? gamify.sub : gamify.blue,
          border: `1px solid ${locked ? gamify.gray : gamify.blue}`,
          fontWeight: 700,
          fontSize: '0.7rem',
        }}
      />

      {/* Action button */}
      <Button
        variant="contained"
        size="small"
        startIcon={isCloning ? <CircularProgress size={14} color="inherit" /> : <AddIcon />}
        onClick={() => onClone(folder.id)}
        disabled={locked || isCloning}
        sx={{ ...btn3d(gamify.green, gamify.greenDark), mt: 'auto', fontSize: '0.78rem' }}
      >
        {isCloning ? 'Adding...' : 'Add to My Folders'}
      </Button>
    </Box>
  );
}
