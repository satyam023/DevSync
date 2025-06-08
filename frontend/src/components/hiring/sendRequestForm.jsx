import React, { useState, useEffect } from 'react';
import { Card,CardContent, Button, TextField, Typography, Stack, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import API from '../../utils/axios.jsx';
import { useNavigate } from 'react-router-dom';

const SendRequestForm =() => {
  const navigate = useNavigate();
  const { userId } = useParams(); 
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [alreadyPending, setAlreadyPending] = useState(false);
  const [refreshCheck, setRefreshCheck] = useState(false);
  const role = 'developer'; 

  useEffect(() => {
  const checkPendingRequest = async () => {
    try {
      const res = await API.get(`/hiring/check/${userId}`);
      if (res.data.exists) {
        setAlreadyPending(true);
        setStatus('Request already pending.');
      }
    } catch (error) {
      console.error('Check error:', error.response?.data || error.message);
    }
  };

  if (userId) checkPendingRequest();
}, [userId, refreshCheck]);


  const handleSend = async () => {
    try {
      const response = await API.post('/hiring/create', {
        candidateId: userId,
        role,      
        duration,
        message
      });

      setStatus(response.data.message || 'Request sent successfully!');
      setAlreadyPending(true);
    } catch (error) {
      console.error('Send error:', error.response?.data || error.message);
      setStatus(error.response?.data?.message || 'Failed to send request.');
    }
  };

  return (
    <Card sx={{ my: 2, width: '100%', maxWidth: 500, mx: 'auto', position: 'relative' }}>
      <IconButton
      onClick={() => navigate(-1)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      <CardContent sx={{ paddingTop: 5 }}>
        <Typography variant="h6" gutterBottom>
          Send Hiring Request
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Duration (e.g., 3 weeks, 2 months)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            fullWidth
            required
            disabled={alreadyPending}
          />

          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
            disabled={alreadyPending}
          />

          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!duration || !message || alreadyPending}
          >
            {alreadyPending ? 'Request Pending' : 'Send'}
          </Button>

          {status && (
            <Typography color={status.includes('successfully') ? 'primary' : 'error'}>
              {status}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SendRequestForm;
