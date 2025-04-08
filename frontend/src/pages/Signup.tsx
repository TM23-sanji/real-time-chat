import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
}

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleToggle=()=>{
    setShowPassword(prev=>!prev)
  }

  const onSubmit = (data: SignupFormInputs) => {
    console.log("Signup Data:", data);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 2000); // Simulated API call
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f4f6f8"
    >
      <Paper elevation={4} sx={{ padding: 4, width: 350 }}>
        <Typography fontWeight={'700'} variant="h5" mb={3} textAlign="center">Sign Up</Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword?'text':'password'}
            variant="outlined"
            margin="normal"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment:(
                <InputAdornment position='end'>
                    <IconButton onClick={handleToggle} edge='end'>
                        {showPassword? <VisibilityOff/>:<Visibility/>}
                    </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </Button>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Signup;
