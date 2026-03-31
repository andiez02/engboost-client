import { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from '@mui/material';
import PasswordIcon from '@mui/icons-material/Password';
import LockResetIcon from '@mui/icons-material/LockReset';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import { alpha } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '../../utils/validator';
import FieldErrorAlert from '../../components/Form/FieldErrorAlert';
import { useDispatch } from 'react-redux';
import { logoutUserAPI, updateUserAPI } from '../../redux/user/userSlice';
import { toast } from 'react-toastify';
import { gamify, btn3d } from '../../theme';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': { borderColor: gamify.gray, borderWidth: 2 },
    '&:hover fieldset': { borderColor: gamify.blue },
    '&.Mui-focused fieldset': { borderColor: gamify.blue },
  },
};

export default function SecurityTab() {
  const dispatch = useDispatch();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const handleChangePassword = (data) => {
    setFormData(data);
    setConfirmDialogOpen(true);
  };

  const handleConfirmChangePassword = () => {
    const { current_password, new_password } = formData;
    toast.promise(dispatch(updateUserAPI({ current_password, new_password })), { pending: 'Đang cập nhật...' })
      .then((res) => {
        if (!res.error) {
          toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
          setConfirmDialogOpen(false);
          dispatch(logoutUserAPI(false));
        }
      });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Left: Info panel */}
      <div className="lg:w-56 shrink-0">
        <div
          className="flex flex-col items-center gap-3 p-6 rounded-2xl text-center"
          style={{ backgroundColor: gamify.surface, border: `2px solid ${gamify.gray}` }}
        >
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl"
            style={{ backgroundColor: alpha(gamify.blue, 0.1) }}
          >
            <ShieldIcon sx={{ fontSize: 32, color: gamify.blue }} />
          </div>
          <Typography sx={{ fontWeight: 900, color: gamify.text, fontSize: '0.95rem' }}>
            Password
          </Typography>
          <Typography sx={{ color: gamify.sub, fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.5 }}>
            Use a strong password to keep your account secure
          </Typography>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1">
        <Typography
          sx={{ fontWeight: 900, fontSize: '1.1rem', color: gamify.text, mb: 0.5, letterSpacing: '-0.01em' }}
        >
          Change Password
        </Typography>
        <Typography sx={{ color: gamify.sub, fontWeight: 600, fontSize: '0.85rem', mb: 4 }}>
          After changing, you'll be logged out and need to sign in again
        </Typography>

        <form onSubmit={handleSubmit(handleChangePassword)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 480 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: gamify.sub, letterSpacing: '0.05em', mb: 1 }}>
                CURRENT PASSWORD
              </Typography>
              <TextField
                fullWidth size="small" type="password" variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon fontSize="small" sx={{ color: gamify.sub }} />
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
                {...register('current_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE },
                })}
                error={!!errors['current_password']}
              />
              <FieldErrorAlert errors={errors} fieldName="current_password" />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: gamify.sub, letterSpacing: '0.05em', mb: 1 }}>
                NEW PASSWORD
              </Typography>
              <TextField
                fullWidth size="small" type="password" variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" sx={{ color: gamify.blue }} />
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
                {...register('new_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE },
                })}
                error={!!errors['new_password']}
              />
              <FieldErrorAlert errors={errors} fieldName="new_password" />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: gamify.sub, letterSpacing: '0.05em', mb: 1 }}>
                CONFIRM NEW PASSWORD
              </Typography>
              <TextField
                fullWidth size="small" type="password" variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockResetIcon fontSize="small" sx={{ color: gamify.blue }} />
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
                {...register('new_password_confirmation', {
                  validate: (value) =>
                    value === watch('new_password') || 'Password confirmation does not match.',
                })}
                error={!!errors['new_password_confirmation']}
              />
              <FieldErrorAlert errors={errors} fieldName="new_password_confirmation" />
            </Box>

            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              sx={{ ...btn3d(gamify.blue, gamify.blueDark), alignSelf: 'flex-start', px: 4, py: 1.2 }}
            >
              Update Password
            </Button>
          </Box>
        </form>
      </div>

      {/* Confirm dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' },
        }}
      >
        <DialogTitle sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: alpha(gamify.blue, 0.1), color: gamify.blue, width: 42, height: 42 }}>
            <LockResetIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={900}>Đổi mật khẩu</Typography>
            <Typography variant="body2" color="text.secondary">Bạn có chắc chắn muốn đổi mật khẩu?</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 0 }}>
          <Typography variant="body2" color="text.secondary">
            Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại để tiếp tục sử dụng các tính năng của ứng dụng.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: '12px', textTransform: 'none', fontWeight: 700,
              borderColor: gamify.gray, color: gamify.sub, borderWidth: 2,
              '&:hover': { borderColor: gamify.grayDark, backgroundColor: gamify.surface, borderWidth: 2 },
            }}
          >
            Huỷ
          </Button>
          <Button
            onClick={handleConfirmChangePassword}
            variant="contained"
            className="interceptor-loading"
            sx={{
              ...btn3d(gamify.blue, gamify.blueDark),
              textTransform: 'none',
              borderRadius: '12px',
            }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
