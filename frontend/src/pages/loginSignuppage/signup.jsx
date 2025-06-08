import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';
import API from '../../utils/axios.jsx';
import '../../index.css'
import {
  Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Snackbar, Alert, IconButton, InputAdornment, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    gender: 'other',
    password: '',
    role: 'learner',
    rates: '',
    skills: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const isValid =
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.role.trim() !== '' &&
      formData.gender.trim() !== '' &&
      (formData.role === 'recruiter' || formData.skills.trim() !== '') &&
      (formData.role === 'learner' || formData.role === 'recruiter' || formData.rates.trim() !== '');

    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // console.log("Data sends from signup :" , formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
     setLoading(true); 

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('bio', formData.bio);
      data.append('gender', formData.gender);
      data.append('password', formData.password);
      data.append('role', formData.role);
      if (formData.role !== 'recruiter') {
        data.append('skills', formData.skills);
      }
      if (formData.role === 'mentor' || formData.role === 'developer') {
        if (formData.role === 'mentor') {
          data.append('rates[mentor]', formData.rates);
        } else if (formData.role === 'developer') {
          data.append('rates[developer]', formData.rates);
        }
      }
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await API.post('/auth/signup', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }); 
      setUser(res.data.user);
      setToast({ open: true, message: 'Signup successful', severity: 'success' });
      navigate('/home');
    } catch (err) {
      console.error("Signup error:", err.response || err.message || err);
      setToast({
        open: true,
        message: err.response?.data?.message || 'Signup failed',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 30%,  #71baf5 90%)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', p: 0, mb: 3, mt: -2, mx: -2
      }}>
      <Box maxWidth="500px" width="100%" p={4} boxShadow={3} borderRadius={3} bgcolor="white"  >
        <Typography variant="h4" mb={2} textAlign="center">Create Your Account</Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={2}>
            <Grid item xs={12} xm={12} sx={{ width: ['100%', null, '48%'] }}>
              <TextField
                label="Name *"
                name="name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sx={{ width: ['100%', null, '48%'] }}>
              <TextField
                label="Email *"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item sx={{ width: '100%' }} xs={12}>
              <TextField
                label="Bio"
                name="bio"
                fullWidth
                multiline
                minRows={1}
                value={formData.bio}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sx={{ width: ['45%', null, '48%'] }}  >
              <TextField
                label="Password *"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>


            <Grid item xs={12} sm={6} sx={{ width: ['49%', null, '48%'] }} >
              <FormControl fullWidth required>
                <InputLabel id="role-label">Role *</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  label="Role *"
                  onChange={handleChange}
                >
                  <MenuItem value="learner">Learner</MenuItem>
                  <MenuItem value="mentor">Mentor</MenuItem>
                  <MenuItem value="developer">Developer</MenuItem>
                  <MenuItem value="recruiter">Recruiter</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ width: ['45%', null, '48%'] }}   >
              <FormControl fullWidth required>
                <InputLabel id="gender-label">Gender *</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={formData.gender}
                  label="Gender *"
                  onChange={handleChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>


            {formData.role !== 'recruiter' && (
              <Grid item xs={12} sx={{ width: ['48%', null, '48%'] }}>
                <TextField
                  label="Skills (comma-separated) *"
                  name="skills"
                  fullWidth
                  required={formData.role !== 'recruiter'}
                  value={formData.skills}
                  onChange={handleChange}
                  helperText="E.g., React, Node.js, UI/UX"
                />
              </Grid>
            )}
            {(formData.role === 'mentor' || formData.role === 'developer') && (
              <Grid item xs={12} sx={{ width: '500px', }}>
                <TextField
                  label={
                    formData.role === 'mentor'
                      ? 'Rate (₹/month) *'
                      : 'Rate (₹/project) *'
                  }
                  name="rates"
                  type="number"
                  fullWidth
                  required
                  value={formData.rates}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  helperText={
                    formData.role === 'mentor'
                      ? 'Your monthly mentoring rate'
                      : 'Your per-project rate'
                  }
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ py: 1, fontSize: '1rem', width: '500px', }}
              >
                {imageFile ? `Selected: ${imageFile.name}` : 'UPLOAD PROFILE IMAGE'}
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </Button>
            </Grid>
            <Box sx={{
              position: 'sticky',
              backgroundColor: 'background.paper',
            }}>
              {loading ? (
                <Box display="flex" justifyContent="center" sx={{ width: '500px', my: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={!isFormValid}
                  sx={{
                    width: '500px',
                    mx: 'auto',
                    display: 'block',
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  SIGN UP
                </Button>
              )}

            </Box>
          </Grid>
        </form>

        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={toast.severity} onClose={() => setToast(prev => ({ ...prev, open: false }))}>
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Signup;