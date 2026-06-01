import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import NotificationDropdown from './NotificationDropdown';
import useNotifications from '../../hooks/useNotifications';

function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleToggle}
        sx={{
          ml: 1,
          mr: 1,
          p: 1,
          color: open ? '#FF9600' : '#4B4B4B',
          transition: 'all 0.2s',
          ...(open && {
            bgcolor: '#FFF0DE',
            '&:hover': { bgcolor: '#FFF0DE' }
          })
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: '#FF4B4B',
              color: 'white',
              fontWeight: 'bold',
            }
          }}
        >
          <NotificationsRoundedIcon />
        </Badge>
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
        disablePortal
        style={{ zIndex: 1400 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'top right' }}>
            <Box>
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <NotificationDropdown 
                    notifications={notifications}
                    unreadCount={unreadCount}
                    markAsRead={markAsRead}
                    markAllAsRead={markAllAsRead}
                    onClose={() => setOpen(false)}
                  />
                </Box>
              </ClickAwayListener>
            </Box>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default NotificationBell;
