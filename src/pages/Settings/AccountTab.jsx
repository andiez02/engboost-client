import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MailIcon from '@mui/icons-material/Mail';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  FIELD_REQUIRED_MESSAGE,
  singleFileValidator,
} from '../../utils/validator';
import { selectCurrentUser, updateUserAPI } from '../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import FieldErrorAlert from '../../components/Form/FieldErrorAlert';

// Xử lý custom đẹp cái input file ở đây: https://mui.com/material-ui/react-button/#file-upload
// Ngoài ra note thêm lib này từ docs của MUI nó recommend nếu cần dùng: https://github.com/viclafouch/mui-file-input
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

function AccountTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const initialGeneralForm = {
    username: currentUser?.user?.username,
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialGeneralForm,
  });

  const submitChangeGeneralInformation = (data) => {
    const { username } = data;

    if (username === currentUser?.user?.username) return;

    // Call API...
    toast
      .promise(dispatch(updateUserAPI({ username })), {
        pending: 'Updating...',
      })
      .then((res) => {
        console.log('🚀 ~ submitChangeGeneralInformation ~ res:', res);
        if (!res.error) {
          toast.success('Update successfully!');
        }
      });
  };

  const uploadAvatar = (e) => {
    console.log('e.target?.files[0]: ', e.target?.files[0]);
    const error = singleFileValidator(e.target?.files[0]);
    if (error) {
      toast.error(error);
      return;
    }

    let reqData = new FormData();
    reqData.append('avatar', e.target?.files[0]);
    // Cách để log được dữ liệu thông qua FormData

    // console.log('reqData: ', reqData);
    // for (const value of reqData.values()) {
    //   console.log('reqData Value: ', value);
    // }

    // Gọi API...
    toast
      .promise(dispatch(updateUserAPI(reqData)), {
        pending: 'Updating...',
      })
      .then((res) => {
        if (!res.error) {
          toast.success('Update successfully!');
        }
        e.target.value = '';
      });
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{ width: 84, height: 84 }}
              alt="User"
              src={currentUser?.user?.avatar}
            />
            <Tooltip title="Upload a new image to update your avatar immediately.">
              <Button
                component="label"
                variant="contained"
                size="small"
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 1 }}
              >
                Upload
                <VisuallyHiddenInput type="file" onChange={uploadAvatar} />
              </Button>
            </Tooltip>
          </Box>

          <Box>
            <Typography sx={{ color: 'grey' }}>
              @{currentUser?.user?.username}
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
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
                disabled
                defaultValue={currentUser?.user?.email}
                fullWidth
                label="Your Email"
                type="text"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <TextField
                defaultValue={currentUser?.user?.username}
                fullWidth
                label="Your Username"
                type="text"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                {...register('username', {
                  required: FIELD_REQUIRED_MESSAGE,
                })}
                error={!!errors['username']}
              />
              <FieldErrorAlert errors={errors} fieldName={'username'} />
            </Box>

            <Box>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Update
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default AccountTab;
