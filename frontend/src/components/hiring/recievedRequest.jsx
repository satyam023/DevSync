import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Chip, Divider, Box, CircularProgress, Stack, Button, ButtonGroup } from '@mui/material';
import API from '../../utils/axios';

const ReceivedRequests = ({ developerId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); 

  useEffect(() => {
    const fetchReceived = async () => {
      try {
        const res = await API.get('/hiring/received', {
          params: { developerId } 
        });
        setRequests(res.data.hirings || []);
      } catch (error) {
        console.error('Error fetching received requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReceived();
  }, [developerId]);

  const updateStatus = async (id, newStatus) => {
    setActionLoading(id);
    try {
      if (newStatus === 'accepted') {
        await API.patch(`/hiring/accept/${id}`);
      } else if (newStatus === 'rejected') {
        await API.patch(`/hiring/reject/${id}`);
      } else if (newStatus === 'completed') {
        await API.patch(`/hiring/complete/${id}`);
      } else {
        throw new Error('Invalid status update');
      }

      setRequests(prev =>
        prev.map(req => (req._id === id ? { ...req, status: newStatus } : req))
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <CircularProgress sx={{ m: 2 }} />;

  if (!requests.length) return (
    <Card sx={{ mt: 4, p: 2 }}>
      <Typography>No received hiring requests yet.</Typography>
    </Card>
  );

  return (
    <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Hiring Requests Received
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          {requests.map((req) => (
            <Box key={req._id} sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
              <Typography fontWeight="bold">From: {req.recruiter?.name || 'Unknown Recruiter'}</Typography>
              <Typography>Role: {req.role}</Typography>
              <Typography>Duration: {req.duration}</Typography>
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

              {(req.status === 'pending' || req.status === 'accepted') && (
                <ButtonGroup variant="outlined" size="small" disabled={actionLoading === req._id}>
                  {req.status === 'pending' && (
                    <>
                      <Button
                        color="success"
                        onClick={() => updateStatus(req._id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        color="error"
                        onClick={() => updateStatus(req._id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {req.status === 'accepted' && (
                    <Button
                      color="primary"
                      onClick={() => updateStatus(req._id, 'completed')}
                    >
                      Mark Completed
                    </Button>
                  )}
                </ButtonGroup>
              )}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ReceivedRequests;
