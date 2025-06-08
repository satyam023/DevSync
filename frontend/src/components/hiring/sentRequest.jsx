import React, { useEffect, useState } from 'react';
import {  Card,  CardContent,  Typography,  Chip,  Divider,  Box,  CircularProgress,  Stack, Alert, Avatar, Button, Paper
} from '@mui/material';
import API from '../../utils/axios';
import { format } from 'date-fns';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const SentRequests = ({ recruiterId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchSentRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get('/hiring/sent', {
        params: { 
          recruiterId,
          page,
          limit: 10
        }
      });
      setRequests(prev => [...prev, ...res.data.hirings]);
      setHasMore(res.data.hirings.length === 10);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    fetchSentRequests();
  }, [recruiterId, page]);

  const statusIcon = {
    pending: <HourglassEmptyIcon fontSize="small" />,
    accepted: <CheckCircleOutlineIcon fontSize="small" />,
    rejected: <HighlightOffIcon fontSize="small" />
  };

  if (loading && page === 1) return <CircularProgress sx={{ m: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Your Sent Requests
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {requests.length === 0 && !loading ? (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              You haven't sent any hiring requests yet.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {requests.map((req) => (
              <Card key={req._id} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar src={req.candidate?.image} alt={req.candidate?.name}>
                      {req.candidate?.name?.charAt(0)}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography fontWeight="bold">
                        {req.candidate?.name || 'Unknown Developer'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {req.role}
                      </Typography>
                    </Box>
                    <Chip
                      icon={statusIcon[req.status]}
                      label={req.status.toUpperCase()}
                      color={
                        req.status === 'pending' ? 'warning' :
                        req.status === 'accepted' ? 'success' : 'error'
                      }
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={4} mb={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Rate
                      </Typography>
                      <Typography fontWeight="medium">
                        ₹{req.rate}/hr
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography fontWeight="medium">
                        {req.duration}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Sent On
                      </Typography>
                      <Typography fontWeight="medium">
                        {format(new Date(req.createdAt), 'MMM d, yyyy')}
                      </Typography>
                    </Box>
                  </Stack>

                  {req.message && (
                    <Box mt={2}>
                      <Typography variant="caption" color="text.secondary">
                        YOUR MESSAGE
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, mt: 1, borderRadius: 2 }}>
                        <Typography>{req.message}</Typography>
                      </Paper>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}

            {hasMore && (
              <Box textAlign="center" mt={2}>
                <Button 
                  variant="outlined" 
                  onClick={loadMore}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </Box>
            )}
          </Stack>
        )}
      </CardContent>
    </Paper>
  );
};

export default SentRequests;