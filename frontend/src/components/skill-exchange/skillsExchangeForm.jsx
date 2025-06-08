import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import API from '../../utils/axios.jsx'

import { useAuth } from '../../context/authContext.jsx';
import { useLocation, useNavigate } from 'react-router-dom'; 

const SkillExchangeForm = () => {
  const { user: currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); 

  const { recipientId } = location.state || {};

  const [offeredSkills, setOfferedSkills] = useState('');
  const [requestedSkills, setRequestedSkills] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!recipientId || recipientId === currentUser?._id) {
      setError("You can't send a request to yourself.");
      return;
    }

    try {
      const response = await API.post(
        '/skill-exchange/request',
        {
          recipientId,
          offeredSkills: offeredSkills.split(',').map(skill => skill.trim()),
          requestedSkills: requestedSkills.split(',').map(skill => skill.trim())
        },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setOfferedSkills('');
      setRequestedSkills('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request.');
    }
  };

  const handleClose = () => {
    navigate(-1); 
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 500, mx: 'auto', p: 3, mt: 4, position: 'relative' }}>
      <Button
        onClick={handleClose}
        sx={{ position: 'absolute', top: 8, right: 8, minWidth: 'unset', fontSize: '1.2rem' }}
        color="error"
      >
        ❌
      </Button>
      <Typography variant="h5" gutterBottom>
        Request Skill Exchange
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Offered Skills"
          variant="outlined"
          fullWidth
          margin="normal"
          value={offeredSkills}
          onChange={(e) => setOfferedSkills(e.target.value)}
          placeholder="e.g., React, Node.js"
          required
        />
        <TextField
          label="Requested Skills"
          variant="outlined"
          fullWidth
          margin="normal"
          value={requestedSkills}
          onChange={(e) => setRequestedSkills(e.target.value)}
          placeholder="e.g., MongoDB, AWS"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Send Request
        </Button>

        {message && (
          <Alert severity="success" sx={{ mt: 2 }} onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default SkillExchangeForm;
