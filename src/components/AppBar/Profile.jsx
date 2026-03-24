import React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Logout from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserAPI, selectCurrentUser } from '../../redux/user/userSlice';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    handleClose();
  };

  const handleLogoutConfirm = () => {
    dispatch(logoutUserAPI());
    setLogoutDialogOpen(false);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div>
      <Box>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ padding: 0 }}
            aria-controls={open ? 'basic-menu-profiles' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              sx={{ width: 40, height: 40 }}
              alt="User"
              src={currentUser?.user?.avatar}
            />
          </IconButton>
        </Tooltip>
        <Menu
          id="basic-menu-profiles"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          disableScrollLock
          MenuListProps={{
            'aria-labelledby': 'basic-button-profiles',
          }}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              padding: '6px',
              minWidth: '200px',
            },
          }}
        >
          <Link
            to={
              currentUser?.user?.role === 'ADMIN'
                ? '/admin/settings/account'
                : '/settings/account'
            }
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <MenuItem
              sx={{
                borderRadius: '8px',
                padding: '8px 12px',
                margin: '2px 0',
                '&:hover': {
                  backgroundColor: alpha('#3B82F6', 0.08),
                },
              }}
            >
              <Avatar
                sx={{ width: 36, height: 36, mr: 2 }}
                src={currentUser?.user?.avatar}
              />
              <Typography variant="body2" fontWeight={500}>
                Profile
              </Typography>
            </MenuItem>
          </Link>
          <Divider sx={{ margin: '4px 0' }} />
          <MenuItem
            onClick={handleLogoutClick}
            sx={{
              borderRadius: '8px',
              padding: '8px 12px',
              margin: '2px 0',
              '&:hover': {
                backgroundColor: alpha('#F16767', 0.08),
                color: '#F16767',
                '& .logout-icon': { color: '#F16767' },
              },
            }}
          >
            <Logout className="logout-icon" fontSize="small" sx={{ mr: 2 }} />
            <Typography variant="body2" fontWeight={500}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </Box>

      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DialogTitle
          id="logout-dialog-title"
          sx={{
            p: 3,
            pb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: alpha('#F16767', 0.1),
              color: '#F16767',
              width: 42,
              height: 42,
            }}
          >
            <Logout />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Đăng xuất
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 0 }}>
          <Typography variant="body2" color="text.secondary">
            Sau khi đăng xuất, bạn sẽ cần đăng nhập lại để tiếp tục sử dụng các
            tính năng của ứng dụng.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 1,
          }}
        >
          <Button
            onClick={handleLogoutCancel}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 500,
              borderColor: '#E5E7EB',
              color: '#6B7280',
              '&:hover': {
                borderColor: '#D1D5DB',
                backgroundColor: '#F9FAFB',
              },
              px: 2,
              py: 1,
            }}
          >
            Huỷ
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 500,
              backgroundColor: '#F16767',
              boxShadow: `0 4px 12px ${alpha('#F16767', 0.3)}`,
              '&:hover': {
                backgroundColor: '#E55C5C',
              },
              px: 2,
              py: 1,
            }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Profiles;
