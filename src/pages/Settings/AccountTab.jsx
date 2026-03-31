import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, Tooltip, TextField, InputAdornment, Button, Skeleton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MailIcon from '@mui/icons-material/Mail';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LockIcon from '@mui/icons-material/Lock';

import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '../../utils/validator';
import { selectCurrentUser, updateUserAPI } from '../../redux/user/userSlice';
import FieldErrorAlert from '../../components/Form/FieldErrorAlert';
import { gamify, btn3d } from '../../theme';
import { userService } from '../../services/user/user.service';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function AchievementBadge({ achievement }) {
  const isUnlocked = achievement.unlocked;
  return (
    <Tooltip
      title={
        <Box sx={{ p: 0.5 }}>
          <Typography sx={{ fontWeight: 900, fontSize: '0.85rem' }}>{achievement.title}</Typography>
          <Typography sx={{ fontSize: '0.75rem', opacity: 0.85, mt: 0.3 }}>{achievement.description}</Typography>
          {isUnlocked && achievement.unlocked_at && (
            <Typography sx={{ fontSize: '0.7rem', opacity: 0.6, mt: 0.5 }}>
              Đạt được: {new Date(achievement.unlocked_at).toLocaleDateString('vi-VN')}
            </Typography>
          )}
        </Box>
      }
      arrow
      placement="top"
    >
      <div
        className="flex flex-col items-center gap-2 p-4 rounded-2xl cursor-default transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: isUnlocked ? '#fff' : gamify.surface,
          border: `2px solid ${isUnlocked ? gamify.blue : gamify.gray}`,
          borderBottom: `4px solid ${isUnlocked ? gamify.blueDark : gamify.grayDark}`,
          opacity: isUnlocked ? 1 : 0.45,
          filter: isUnlocked ? 'none' : 'grayscale(1)',
          minWidth: 90,
        }}
      >
        <span style={{ fontSize: '2rem', lineHeight: 1 }}>
          {isUnlocked ? (achievement.icon || '🏆') : '🔒'}
        </span>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: '0.7rem',
            color: isUnlocked ? gamify.text : gamify.sub,
            textAlign: 'center',
            letterSpacing: '0.02em',
            lineHeight: 1.3,
            maxWidth: 80,
          }}
        >
          {achievement.title}
        </Typography>
        {isUnlocked && (
          <div
            className="px-2 py-0.5 rounded-full"
            style={{ backgroundColor: gamify.blueBg }}
          >
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, color: gamify.blue, letterSpacing: '0.05em' }}>
              ĐẠT ĐƯỢC
            </Typography>
          </div>
        )}
      </div>
    </Tooltip>
  );
}

export default function AccountTab() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [achievements, setAchievements] = useState([]);
  const [achLoading, setAchLoading] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { username: currentUser?.user?.username },
  });

  useEffect(() => {
    userService.getAchievements()
      .then((res) => setAchievements(res.data ?? []))
      .catch(() => setAchievements([]))
      .finally(() => setAchLoading(false));
  }, []);

  const submitChangeGeneralInformation = (data) => {
    const { username } = data;
    if (username === currentUser?.user?.username) return;
    toast.promise(dispatch(updateUserAPI({ username })), { pending: 'Updating...' })
      .then((res) => { if (!res.error) toast.success('Update successfully!'); });
  };

  const uploadAvatar = (e) => {
    const error = singleFileValidator(e.target?.files[0]);
    if (error) { toast.error(error); return; }
    let reqData = new FormData();
    reqData.append('avatar', e.target?.files[0]);
    toast.promise(dispatch(updateUserAPI(reqData)), { pending: 'Updating...' })
      .then((res) => { if (!res.error) toast.success('Update successfully!'); e.target.value = ''; });
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="flex flex-col gap-10">
      {/* ── Top: Profile + Form ── */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Avatar */}
        <div className="flex flex-col items-center gap-4 lg:w-56 shrink-0">
          <div
            className="flex flex-col items-center gap-3 p-6 rounded-2xl w-full"
            style={{ backgroundColor: gamify.surface, border: `2px solid ${gamify.gray}` }}
          >
            <Avatar
              sx={{ width: 96, height: 96, border: `3px solid ${gamify.blue}` }}
              alt="User"
              src={currentUser?.user?.avatar}
            />
            <div className="text-center">
              <Typography sx={{ fontWeight: 900, color: gamify.text, fontSize: '1rem' }}>
                {currentUser?.user?.username}
              </Typography>
              <Typography sx={{ color: gamify.sub, fontSize: '0.8rem', fontWeight: 600 }}>
                {currentUser?.user?.email}
              </Typography>
            </div>
            <Tooltip title="Upload a new image to update your avatar immediately.">
              <Button
                component="label"
                variant="contained"
                size="small"
                startIcon={<CloudUploadIcon />}
                sx={{ ...btn3d(gamify.blue, gamify.blueDark), width: '100%', py: 1 }}
              >
                Upload Photo
                <VisuallyHiddenInput type="file" onChange={uploadAvatar} />
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex-1">
          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: gamify.text, mb: 0.5, letterSpacing: '-0.01em' }}>
            General Information
          </Typography>
          <Typography sx={{ color: gamify.sub, fontWeight: 600, fontSize: '0.85rem', mb: 4 }}>
            Update your display name and profile details
          </Typography>

          <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 480 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: gamify.sub, letterSpacing: '0.05em', mb: 1 }}>
                  EMAIL ADDRESS
                </Typography>
                <TextField
                  disabled
                  defaultValue={currentUser?.user?.email}
                  fullWidth type="text" variant="outlined" size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailIcon fontSize="small" sx={{ color: gamify.sub }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: gamify.surface,
                      '& fieldset': { borderColor: gamify.gray, borderWidth: 2 },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: gamify.sub, letterSpacing: '0.05em', mb: 1 }}>
                  USERNAME
                </Typography>
                <TextField
                  defaultValue={currentUser?.user?.username}
                  fullWidth type="text" variant="outlined" size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBoxIcon fontSize="small" sx={{ color: gamify.blue }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': { borderColor: gamify.gray, borderWidth: 2 },
                      '&:hover fieldset': { borderColor: gamify.blue },
                      '&.Mui-focused fieldset': { borderColor: gamify.blue },
                    },
                  }}
                  {...register('username', { required: FIELD_REQUIRED_MESSAGE })}
                  error={!!errors['username']}
                />
                <FieldErrorAlert errors={errors} fieldName="username" />
              </Box>

              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                sx={{ ...btn3d(gamify.green, gamify.greenDark), alignSelf: 'flex-start', px: 4, py: 1.2 }}
              >
                Save Changes
              </Button>
            </Box>
          </form>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 2, backgroundColor: gamify.gray, borderRadius: 99 }} />

      {/* ── Achievements ── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: gamify.text, letterSpacing: '-0.01em' }}>
            Thành tựu
          </Typography>
          {!achLoading && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{ backgroundColor: gamify.blueBg, border: `2px solid ${gamify.blue}` }}
            >
              <span style={{ fontSize: '0.9rem' }}>🏆</span>
              <Typography sx={{ fontWeight: 900, fontSize: '0.8rem', color: gamify.blue }}>
                {unlockedCount}/{achievements.length}
              </Typography>
            </div>
          )}
        </div>
        <Typography sx={{ color: gamify.sub, fontWeight: 600, fontSize: '0.85rem', mb: 4 }}>
          Các thành tựu bạn đã đạt được trong quá trình học
        </Typography>

        {achLoading ? (
          <div className="flex gap-4 flex-wrap">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rounded" width={90} height={120} sx={{ borderRadius: '16px' }} />
            ))}
          </div>
        ) : achievements.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 rounded-2xl"
            style={{ backgroundColor: gamify.surface, border: `2px dashed ${gamify.gray}` }}
          >
            <span style={{ fontSize: '2.5rem' }}>🎯</span>
            <Typography sx={{ fontWeight: 900, color: gamify.sub, mt: 1 }}>
              Chưa có thành tựu nào
            </Typography>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {achievements.map((ach) => (
              <AchievementBadge key={ach.id} achievement={ach} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
