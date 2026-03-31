import React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Grow from '@mui/material/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserAPI, selectCurrentUser } from '../../redux/user/userSlice';

function Profiles() {
  const anchorRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const closeTimerRef = React.useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const stats = useSelector((state) => state.study.stats);

  const xp = stats?.xp ?? 0;
  const level = stats?.level ?? 1;
  const streak = stats?.streak ?? 0;
  const xpForNextLevel = stats?.xpForNextLevel ?? 10;
  const xpForCurrentLevel = stats?.xpForCurrentLevel ?? 0;
  const xpInLevel = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const xpProgress = xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 0;
  const username =
    currentUser?.user?.username ||
    currentUser?.user?.email?.split('@')[0] ||
    'User';

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setMenuOpen(false), 150);
  };

  const openMenu = () => {
    clearCloseTimer();
    setMenuOpen(true);
  };

  const handleClose = () => {
    clearCloseTimer();
    setMenuOpen(false);
  };

  const handleLogoutCancel = () => setLogoutDialogOpen(false);

  React.useEffect(() => () => clearCloseTimer(), []);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    handleClose();
  };

  const handleLogoutConfirm = () => {
    dispatch(logoutUserAPI());
    setLogoutDialogOpen(false);
  };

  const settingsPath =
    currentUser?.user?.role === 'ADMIN'
      ? '/admin/settings/account'
      : '/settings/account';

  return (
    <div>
      {/* Avatar trigger */}
      <Box
        ref={anchorRef}
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
        sx={{ display: 'inline-flex' }}
      >
        <Tooltip title="Tài khoản">
          <IconButton onClick={openMenu} size="small" sx={{ p: 0 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  border: '2.5px solid #FF9600',
                  boxShadow: '0 0 0 2px #fff',
                }}
                alt={username}
                src={currentUser?.user?.avatar}
              />
              {/* Level badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: '#FF9600',
                  border: '2px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography fontWeight={900} fontSize="0.55rem" color="#fff" lineHeight={1}>
                  {level}
                </Typography>
              </Box>
            </Box>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Dropdown — dùng Popper thay Menu để không có backdrop */}
      <Popper
        open={menuOpen}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
        style={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'right top' }}>
            <Paper
              onMouseEnter={openMenu}
              onMouseLeave={scheduleClose}
              sx={{
                mt: 1,
                borderRadius: '16px',
                border: '2px solid #E5E5E5',
                borderBottom: '4px solid #E5E5E5',
                boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                minWidth: 260,
                overflow: 'hidden',
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  {/* Profile header */}
                  <Box sx={{ px: 2, pt: 1.5, pb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{ width: 42, height: 42, border: '2px solid #E5E5E5' }}
                        src={currentUser?.user?.avatar}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={800} fontSize="0.9rem" color="#4B4B4B" noWrap>
                          {username}
                        </Typography>
                        <Typography fontWeight={600} fontSize="0.7rem" color="#AFAFAF" noWrap>
                          {currentUser?.user?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ mx: 1, borderColor: '#F0F0F0' }} />

                  {/* XP & Level + Streak card */}
                  <Box sx={{ px: 1, py: 1 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: '#FFFBF0',
                        border: '1.5px solid #FFE8B0',
                      }}
                    >
                      {/* Level row */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            bgcolor: '#FF9600',
                            border: '2px solid #E68600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 0 #CC7A00',
                            flexShrink: 0,
                          }}
                        >
                          <Typography fontWeight={900} fontSize="0.75rem" color="#fff">
                            {level}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={800} fontSize="0.8rem" color="#4B4B4B">
                            Level {level}
                          </Typography>
                        </Box>
                        <Typography fontWeight={800} fontSize="0.7rem" color="#FF9600">
                          ⚡ {xp} XP
                        </Typography>
                      </Box>

                      {/* Progress bar */}
                      <Box sx={{ mb: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={xpProgress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: '#FFE8B0',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background: 'linear-gradient(90deg, #FFC800, #FF9600)',
                              transition: 'transform 0.6s ease',
                            },
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography fontWeight={700} fontSize="0.6rem" color="#C9A24D">
                            {xpInLevel} / {xpNeeded} XP
                          </Typography>
                          <Typography fontWeight={700} fontSize="0.6rem" color="#C9A24D">
                            Level {level + 1} →
                          </Typography>
                        </Box>
                      </Box>

                      {/* Streak pill */}
                      {streak > 0 && (
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            bgcolor: '#FFF0DE',
                            border: '1px solid #FFC800',
                            borderRadius: 2,
                            px: 1,
                            py: 0.25,
                          }}
                        >
                          <span style={{ fontSize: '0.7rem' }}>🔥</span>
                          <Typography fontWeight={800} fontSize="0.65rem" color="#FF9600">
                            {streak} ngày
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ mx: 1, borderColor: '#F0F0F0' }} />

                  {/* Action items */}
                  <Box sx={{ px: 1, py: 0.5 }}>
                    <ButtonBase
                      onClick={() => { handleClose(); navigate(settingsPath); }}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        px: 1.5,
                        py: 1,
                        borderRadius: '10px',
                        justifyContent: 'flex-start',
                        transition: 'all 0.15s',
                        '&:hover': { bgcolor: '#F5F5F5' },
                      }}
                    >
                      <Settings sx={{ fontSize: 18, color: '#AFAFAF' }} />
                      <Typography fontWeight={700} fontSize="0.85rem" color="#4B4B4B">
                        Cài đặt
                      </Typography>
                    </ButtonBase>

                    <ButtonBase
                      onClick={handleLogoutClick}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        px: 1.5,
                        py: 1,
                        borderRadius: '10px',
                        justifyContent: 'flex-start',
                        transition: 'all 0.15s',
                        '&:hover': { bgcolor: '#FFF0F0', '& *': { color: '#FF4B4B !important' } },
                      }}
                    >
                      <Logout sx={{ fontSize: 18, color: '#AFAFAF' }} />
                      <Typography fontWeight={700} fontSize="0.85rem" color="#4B4B4B">
                        Đăng xuất
                      </Typography>
                    </ButtonBase>
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {/* Logout confirmation overlay */}
      {logoutDialogOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            },
          }}
          onClick={handleLogoutCancel}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              bgcolor: '#fff',
              width: '100%',
              maxWidth: 360,
              borderRadius: 5,
              border: '2px solid #E5E5E5',
              borderBottom: '6px solid #E5E5E5',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              animation: 'popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              '@keyframes popUp': {
                '0%': { transform: 'scale(0.9)', opacity: 0 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              },
            }}
          >
            <Box sx={{ fontSize: '3rem', mb: 1 }}>👋</Box>
            <Typography fontWeight={900} fontSize="1.4rem" color="#4B4B4B" sx={{ mb: 0.5 }}>
              Đăng xuất?
            </Typography>
            <Typography fontWeight={600} fontSize="0.9rem" color="#AFAFAF" sx={{ mb: 3, lineHeight: 1.5 }}>
              Bạn sẽ cần đăng nhập lại để tiếp tục học.
            </Typography>

            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <ButtonBase
                onClick={handleLogoutCancel}
                sx={{
                  width: '100%',
                  bgcolor: '#58CC02',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  py: 1.5,
                  borderRadius: 3,
                  borderBottom: '4px solid #46A302',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.1s',
                  '&:active': { transform: 'translateY(4px)', borderBottomWidth: 0 },
                }}
              >
                Ở lại học tiếp
              </ButtonBase>
              <ButtonBase
                onClick={handleLogoutConfirm}
                sx={{
                  width: '100%',
                  bgcolor: '#fff',
                  color: '#FF4B4B',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  py: 1.5,
                  borderRadius: 3,
                  border: '2px solid #E5E5E5',
                  borderBottom: '4px solid #E5E5E5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.1s',
                  '&:active': { transform: 'translateY(4px)', borderBottomWidth: '0px' },
                }}
              >
                Đăng xuất
              </ButtonBase>
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default Profiles;
