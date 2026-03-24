import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import PasswordIcon from '@mui/icons-material/Password';
import LockResetIcon from '@mui/icons-material/LockReset';
import LockIcon from '@mui/icons-material/Lock';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';

import { useForm } from 'react-hook-form';
import {
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from '../../utils/validator';
import FieldErrorAlert from '../../components/Form/FieldErrorAlert';
import { useDispatch } from 'react-redux';
import { logoutUserAPI, updateUserAPI } from '../../redux/user/userSlice';
import { toast } from 'react-toastify';

function SecurityTab() {
  const dispatch = useDispatch();
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleChangePassword = (data) => {
    setFormData(data);
    setConfirmDialogOpen(true);
  };

  const handleConfirmChangePassword = () => {
    const { current_password, new_password } = formData;
    toast
      .promise(dispatch(updateUserAPI({ current_password, new_password })), {
        pending: 'Đang cập nhật...',
      })
      .then((res) => {
        if (!res.error) {
          toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
          setConfirmDialogOpen(false);
          dispatch(logoutUserAPI(false));
        }
      });
  };

  const handleCancelChangePassword = () => {
    setConfirmDialogOpen(false);
    setFormData(null);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h5">Security Dashboard</Typography>
        </Box>
        <form onSubmit={handleSubmit(handleChangePassword)}>
          <Box
            sx={{
              width: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                {...register('current_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE,
                  },
                })}
                error={!!errors['current_password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'current_password'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                {...register('new_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE,
                  },
                })}
                error={!!errors['new_password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'new_password'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="New Password Confirmation"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockResetIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                {...register('new_password_confirmation', {
                  validate: (value) => {
                    if (value === watch('new_password')) return true;
                    return 'Password confirmation does not match.';
                  },
                })}
                error={!!errors['new_password_confirmation']}
              />
              <FieldErrorAlert
                errors={errors}
                fieldName={'new_password_confirmation'}
              />
            </Box>

            <Box>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Change
              </Button>
            </Box>
          </Box>
        </form>
      </Box>

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelChangePassword}
        aria-labelledby="change-password-dialog-title"
        aria-describedby="change-password-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DialogTitle
          id="change-password-dialog-title"
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
              bgcolor: alpha('#3B82F6', 0.1),
              color: '#3B82F6',
              width: 42,
              height: 42,
            }}
          >
            <LockResetIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Đổi mật khẩu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bạn có chắc chắn muốn đổi mật khẩu?
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 0 }}>
          <Typography variant="body2" color="text.secondary">
            Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại để tiếp tục sử dụng
            các tính năng của ứng dụng.
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
            onClick={handleCancelChangePassword}
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
            onClick={handleConfirmChangePassword}
            variant="contained"
            className="interceptor-loading"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 500,
              backgroundColor: '#3B82F6',
              boxShadow: `0 4px 12px ${alpha('#3B82F6', 0.3)}`,
              '&:hover': {
                backgroundColor: '#2563EB',
              },
              px: 2,
              py: 1,
            }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SecurityTab;
