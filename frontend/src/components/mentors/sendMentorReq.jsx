import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Button, TextField, Typography, Stack, IconButton, Alert, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import API from '../../utils/axios.jsx';
import { useNavigate } from 'react-router-dom';

const SendMentorRequestForm = () => {
  const navigate = useNavigate();
  const { mentorId } = useParams();
  const [message, setMessage] = useState('');
  const [OfferedRate, setOfferedRate] = useState();
  const [alreadyPending, setAlreadyPending] = useState(false);
  const [status, setStatus] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  // Check if a request to this mentor is already pending
  useEffect(() => {
    if (!mentorId) return;

    const checkPending = async () => {
      setLoadingCheck(true);
      try {
        const res = await API.get(`/mentor-requests/check/${mentorId}`);
        console.log('Check pending response:', res.data);  // Debug
        if (res.data.exists) {
          setAlreadyPending(true);
          setStatus({ severity: 'warning', message: 'Request already pending for this mentor.' });
        } else {
          setAlreadyPending(false);
          setStatus(null);
        }
      } catch (error) {
        setStatus({ severity: 'error', message: 'Failed to check request status.' });
        console.error('Check error:', error.response?.data || error.message);
      } finally {
        setLoadingCheck(false);
      }
    };

    checkPending();
  }, [mentorId]);


  const handleSend = async () => {
    setLoadingSend(true);
    setStatus(null);
    console.log('Sending mentor request:', { mentorId, message });

    try {
      const response = await API.post('/mentor-requests/send', {
        mentorId,
        message,
        offeredRate: OfferedRate
      });
      setStatus({ severity: 'success', message: response.data.message || 'Mentor request sent successfully!' });
      setAlreadyPending(true);
    } catch (error) {
      setStatus({ severity: 'error', message: error.response?.data?.message || 'Failed to send mentor request.' });
      console.error('Send error:', error.response?.data || error.message);
    } finally {
      setLoadingSend(false);
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
        <Typography variant="h6" gutterBottom>Send Mentor Request</Typography>

        {loadingCheck ? (
          <CircularProgress />
        ) : (
          <Stack spacing={2}>
            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={3}
              fullWidth
              required
              disabled={loadingSend || alreadyPending}
            />
            <TextField
              label="Rate Offered"
              type="number"
              value={OfferedRate === undefined ? '' : OfferedRate}
              onChange={(e) => {
                const value = e.target.value;
                setOfferedRate(value === '' ? undefined : Number(value));
              }}
              fullWidth
              required
              disabled={loadingSend || alreadyPending}
            />


            <Button
              variant="contained"
              onClick={handleSend}
              disabled={!message || loadingSend || alreadyPending || OfferedRate <= 0}

              startIcon={loadingSend && <CircularProgress size={20} />}
            >
              {alreadyPending ? 'Request Pending' : 'Send'}
            </Button>

            {status && (
              <Alert severity={status.severity}>
                {status.message}
              </Alert>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default SendMentorRequestForm;
