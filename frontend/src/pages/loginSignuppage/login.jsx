import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';
import { Box, Button, TextField, Typography, Alert, CircularProgress,Avatar} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const { success, error } = await login(formData);
      
      if (success) {
        navigate('/home');
      } else {
        setError(error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{  display: 'flex', justifyContent: 'center',alignItems: 'flex-start',   minHeight: 'calc(100vh - 128px)',
   background: 'linear-gradient(135deg, #e3f2fd 30%, #71baf5 90%)',pt: 2,pb: 2,m:-2,px:0}}>
      <Box sx={{ width: '100%',maxWidth: '400px',bgcolor: 'background.paper',borderRadius: 2,boxShadow: 3,p: 3,mt: 2,mb: 2}}>
        <Box sx={{ display: 'flex', flexDirection: 'column',alignItems: 'center', mb: 1 
        }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main',
            width: 40,
            height: 40
          }}>
            <LockOutlinedIcon fontSize="small" />
          </Avatar>
          <Typography component="h1" variant="h6" sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            mt: 1
          }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to continue
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 1.5, mt: 1 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField fullWidth required label="Email Address" type="email" margin="dense" size="small" value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            sx={{ mb: 1 }}
          />
          
          <TextField
            fullWidth
            required
            label="Password"
            type="password"
            margin="dense"
            size="small"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            sx={{ mb: 1 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{  mt: 1.5, mb: 1,py: 0.8,
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Sign In'}
          </Button>
          
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 1
          }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link to="/signup" style={{ 
                textDecoration: 'none',
                color: '#1976d2',
                fontWeight: 500
              }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;