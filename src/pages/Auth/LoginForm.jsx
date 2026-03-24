import React, { useEffect, useState } from 'react';
import Header from '../../components/Layout/Header';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Card as MuiCard, InputAdornment, IconButton } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Zoom from '@mui/material/Zoom';
import Alert from '@mui/material/Alert';

// Icons
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

// Internal Components & Utils
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from '../../utils/validator';
import FieldErrorAlert from '../../components/Form/FieldErrorAlert';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../../components/Layout/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { loginUserAPI } from '../../redux/user/userSlice';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  let [searchParams] = useSearchParams();
  const registeredEmail = searchParams.get('registeredEmail');
  const verifiedEmail = searchParams.get('verifiedEmail');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Xử lý chuyển hướng sau khi đăng nhập thành công
  useEffect(() => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

  const submitLogIn = async (data) => {
    try {
      const { email, password } = data;
      const result = await dispatch(loginUserAPI({ email, password })).unwrap();

      if (result.message) {
        toast.success(result.message);
      }

      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fdfcf0' }}>
      <Header />
      
      <Box 
        className="animate-gradient"
        sx={{ 
          height: '100vh',
          flexShrink: 0,
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: 'linear-gradient(-45deg, #fdfcf0, #f3f1e0, #b4c3a2, #dfbbb1)',
          backgroundSize: '400% 400%',
          p: { xs: 0, md: 4 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box sx={{ 
          position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', 
          background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(80px)' 
        }} />
        <Box sx={{ 
          position: 'absolute', bottom: '10%', right: '5%', width: '250px', height: '250px', 
          background: 'rgba(99, 102, 241, 0.2)', borderRadius: '50%', filter: 'blur(60px)' 
        }} />

        <Box className="w-full md:w-[450px] z-10">
          <form onSubmit={handleSubmit(submitLogIn)}>
            <Zoom in={true} style={{ transitionDelay: '200ms' }}>
              <MuiCard
                elevation={0}
                sx={{
                  minHeight: { xs: "calc(100vh - 60px)", md: "auto" },
                  borderRadius: { xs: "26px 26px 0 0", md: "24px" },
                  marginTop: { xs: "60px", md: "0" },
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                  p: { xs: 2, md: 4 }
                }}
              >
                {/* Header Section */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Box sx={{ 
                    display: 'inline-flex', p: 2, borderRadius: '16px', 
                    bgcolor: '#fdfcf0', color: '#b4c3a2', mb: 2,
                    boxShadow: '0 8px 16px -4px rgba(180, 195, 162, 0.3)',
                    border: '1px solid rgba(180, 195, 162, 0.2)'
                  }}>
                    <LogIn size={32} />
                  </Box>
                  <Typography variant="h4" fontWeight="800" color="text.primary" gutterBottom>
                    Chào mừng trở lại!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đăng nhập để tiếp tục học tập cùng EngBoost
                  </Typography>
                </Box>

                {/* Alerts Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  {localStorage.getItem('redirectAfterLogin') && (
                    <Alert severity="info" sx={{ borderRadius: '12px' }}>
                      Vui lòng đăng nhập để tiếp tục.
                    </Alert>
                  )}
                  {verifiedEmail && (
                    <Alert severity="success" sx={{ borderRadius: '12px' }}>
                      Email <strong>{verifiedEmail}</strong> đã xác minh thành công!
                    </Alert>
                  )}
                  {registeredEmail && (
                    <Alert severity="info" sx={{ borderRadius: '12px' }}>
                      Đã gửi email xác minh đến <strong>{registeredEmail}</strong>.
                    </Alert>
                  )}
                </Box>

                {/* Form Fields */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  <Box>
                    <TextField
                      autoFocus
                      fullWidth
                      label="Email"
                      type="text"
                      variant="outlined"
                      error={!!errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={20} color={errors.email ? '#d32f2f' : '#b4c3a2'} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: '12px' }
                      }}
                      {...register('email', {
                        required: FIELD_REQUIRED_MESSAGE,
                        pattern: {
                          value: EMAIL_RULE,
                          message: EMAIL_RULE_MESSAGE,
                        },
                      })}
                    />
                    <FieldErrorAlert errors={errors} fieldName={'email'} />
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      label="Mật khẩu"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      error={!!errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={20} color={errors.password ? '#d32f2f' : '#b4c3a2'} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility} edge="end" size="small">
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: '12px' }
                      }}
                      {...register('password', {
                        required: FIELD_REQUIRED_MESSAGE,
                        pattern: {
                          value: PASSWORD_RULE,
                          message: PASSWORD_RULE_MESSAGE,
                        },
                      })}
                    />
                    <FieldErrorAlert errors={errors} fieldName={'password'} />
                  </Box>
                </Box>

                {/* Actions */}
                <CardActions sx={{ mt: 4, px: 0 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                      mt: 1,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: '1rem',
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #b4c3a2 0%, #8fa37a 100%)',
                      boxShadow: '0 8px 20px rgba(180, 195, 162, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 28px rgba(180, 195, 162, 0.4)',
                        background: 'linear-gradient(135deg, #a5b593 0%, #7d8f6b 100%)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    Đăng nhập
                  </Button>
                </CardActions>

                {/* Footer Links */}
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Chưa có tài khoản?{' '}
                    <Typography
                      component="span"
                      onClick={() => navigate('/register')}
                      sx={{
                        color: '#b4c3a2',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: '#8fa37a',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Tạo tài khoản mới
                    </Typography>
                  </Typography>
                </Box>
              </MuiCard>
            </Zoom>
          </form>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default Login;
