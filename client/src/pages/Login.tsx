import { useState } from 'react';
import {  Box,  Paper,  TextField,  Button,  Typography,IconButton,  CircularProgress,  InputAdornment,} from '@mui/material';
import { useForm } from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

import  Visibility from '@mui/icons-material/Visibility';
import  VisibilityOff from '@mui/icons-material/VisibilityOff';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const navigate= useNavigate();

   const handleToggle = () =>{
    setShowPassword(prev=> !prev)
   }

  const onSubmit = (data: LoginFormInputs) => {
    console.log("Login Data:", data);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);navigate('/')
    }, 2000); // Simulate API
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
        <Typography fontWeight={'700'} variant="h5" mb={3} textAlign="center">Login</Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
            variant="outlined"
            margin="normal"
            type={showPassword ? 'text':'password'}
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggle} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate('/signup')} 
          >
            Sign Up
          </Button>

        </form>
      </Paper>
    </Box>
  );
};

export default Login;
