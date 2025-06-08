import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Chip, Divider, Box,
  CircularProgress, Stack, Button, ButtonGroup
} from '@mui/material';
import API from '../../utils/axios';

const ReceivedMentorRequests = ({ mentorId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!mentorId) return;

    const fetchReceived = async () => {
      try {
        const res = await API.get('/mentor-requests/received', {
          params: { mentorId }
        });
        setRequests(res.data.requests || []);  // adapt based on your API response structure
      } catch (error) {
        console.error('Error fetching received mentor requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceived();
  }, [mentorId]);

  const updateStatus = async (id, newStatus) => {
    setActionLoading(id);
    try {
      if (newStatus === 'accepted') {
        await API.patch(`/mentor-requests/accept/${id}`);
      } else if (newStatus === 'rejected') {
        await API.patch(`/mentor-requests/reject/${id}`);
      } else {
        throw new Error('Invalid status update');
      }

      setRequests(prev =>
        prev.map(req => (req._id === id ? { ...req, status: newStatus } : req))
      );
    } catch (error) {
      console.error('Failed to update mentor request status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <CircularProgress sx={{ m: 2 }} />;

  if (!requests.length) return (
    <Card sx={{ mt: 4, p: 2 }}>
      <Typography>No mentor requests received yet.</Typography>
    </Card>
  );

  return (
    <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Mentor Requests Received
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          {requests.map((req) => (
            <Box key={req._id} sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
              <Typography fontWeight="bold">From: {req.learner?.name || 'Unknown Learner'}</Typography>
              <Typography mb={1}>Message: {req.message}</Typography>
              <Chip
                label={req.status.toUpperCase()}
                color={
                  req.status === 'pending' ? 'warning' :
                    req.status === 'accepted' ? 'success' :
                      req.status === 'rejected' ? 'error' : 'info'
                }
                sx={{ mb: 1 }}
              />

              {req.status === 'pending' && (
                <ButtonGroup variant="outlined" size="small" disabled={actionLoading === req._id}>
                  <Button
                    color="success"
                    onClick={() => updateStatus(req._id, 'accepted')}
                    sx={{ml:1}}
                  >
                    Accept
                  </Button>
                  <Button
                    color="error"
                    onClick={() => updateStatus(req._id, 'rejected')}
                      sx={{ml:1}}
                  >
                    Reject
                  </Button>
                </ButtonGroup>
              )}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ReceivedMentorRequests;
