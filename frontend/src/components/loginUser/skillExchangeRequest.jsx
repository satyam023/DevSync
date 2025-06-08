import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Button, Stack, Alert, Avatar, Divider, CircularProgress, Chip, Tabs, Tab } from '@mui/material';
import API from '../../utils/axios.jsx';
import { CheckCircle, PendingActions, SwapHoriz, ExpandMore, ExpandLess } from '@mui/icons-material';

const SkillExchangeRequests = ({ userId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    pending: true,
    accepted: false,
    sent: false
  });

 const fetchRequests = async () => {
  try {
    setLoading(true);
    const response = await API.get('/skill-exchange/get-skills', { withCredentials: true });
    setRequests(response.data.data);
  } catch (err) {
    setError('Failed to load requests.');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!userId) return;
  fetchRequests(); 
  let count = 0;
  const maxRefreshCount = 2;
  const intervalId = setInterval(() => {
    count++;
    if (count > maxRefreshCount) {
      clearInterval(intervalId);
    } else {
      fetchRequests();
    }
  }, 300000);
  return () => clearInterval(intervalId);
}, [userId, activeTab]);

  const handleRespond = async (exchangeId, status) => {
    try {
      const response = await API.patch(
        `/skill-exchange/${exchangeId}/respond`,
        { status },
        { withCredentials: true }
      );

      const { request, updatedRequester, updatedRecipient } = response.data.data;

      setSuccess(`Request ${status}`);

      setRequests(prev =>
        prev.map(r =>
          r._id === exchangeId
            ? {
              ...request,
              requester: updatedRequester || request.requester,
              recipient: updatedRecipient || request.recipient,
            }
            : r
        )
      );
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to respond to request.');
      setTimeout(() => setError(''), 3000);
    }
  };


  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );

  const visibleRequests = requests.filter(r => r.recipient._id === userId && r.status !== 'rejected');
  const sentByMe = requests.filter(r => r.requester._id === userId);
const pending = requests.filter(
  r => r.status === 'pending' && (r.recipient._id === userId || r.requester._id === userId)
);

const accepted = requests.filter(
  r => r.status === 'accepted' && (r.recipient._id === userId || r.requester._id === userId)
);

  const renderRequestCard = (req, isPending = false) => (
    <Card key={req._id} sx={{
      p: 3,
      borderLeft: '4px solid',
      borderColor: isPending ? 'warning.main' : 'success.main',
      bgcolor: isPending ? 'background.paper' : 'rgba(102, 187, 106, 0.08)',
      boxShadow: isPending ? 2 : 1,
    }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Avatar
          alt={req.requester.name}
          src={req.requester.image || ''}
          sx={{ width: 50, height: 50 }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" color={isPending ? 'inherit' : 'success.dark'}>
            {req.requester.name}
          </Typography>
          <Typography variant="body2" color={req.status === 'rejected' ? 'error.main' : isPending ? 'text.secondary' : 'success.light'}>
            {req.status === 'pending'
              ? `Waiting for response from ${req.recipient?.name || 'user'}`
              : req.status === 'accepted'
                ? `Exchange in progress - accepted by ${req.recipient?.name || 'user'}`
                : req.status === 'rejected'
                  ? `Rejected by ${req.recipient?.name || 'user'}`
                  : ''}
          </Typography>

        </Box>
      </Stack>

      <Divider sx={{ my: 2, borderColor: isPending ? 'divider' : 'success.light' }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Offered Skills:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {req.offeredSkills.map(skill => (
            <Chip
              key={skill}
              label={skill}
              color="primary"
              size="small"
              variant={isPending ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
      </Box>

      <Box sx={{ mb: isPending ? 3 : 0 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Requested Skills:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {req.requestedSkills.map(skill => (
            <Chip
              key={skill}
              label={skill}
              color="secondary"
              size="small"
              variant={isPending ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
      </Box>

      {req.status === 'pending' && req.recipient._id === userId && (
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRespond(req._id, 'rejected')}
            sx={{ px: 3 }}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleRespond(req._id, 'accepted')}
            sx={{ px: 3 }}
          >
            Accept
          </Button>
        </Stack>
      )}

    </Card>
  );

  const renderEmptyState = (message) => (
    <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper', mb: 2 }}>
      <Typography color="text.secondary">{message}</Typography>
    </Card>
  );

  return (
    <Box sx={{ p: 3, minwidth: '90vw', margin: '0 auto', pb: 4, mb: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SwapHoriz fontSize="large" />
        Skill Exchange Requests
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label={`Pending (${pending.length})`} />
        <Tab label={`Accepted (${accepted.length})`} />
        <Tab label={`Sent (${sentByMe.length})`} />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer', color: 'warning.main' }}
            onClick={() => toggleSection('pending')}
          >
            <PendingActions sx={{ mr: 1 }} />
            <Typography variant="h6">Pending Requests</Typography>
            {expandedSections.pending ? <ExpandLess /> : <ExpandMore />}
          </Box>

          {expandedSections.pending && (
            pending.length === 0
              ? renderEmptyState('No pending requests')
              : <Stack spacing={2}>{pending.map(req => renderRequestCard(req, true))}</Stack>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer', color: 'success.main' }}
            onClick={() => toggleSection('accepted')}
          >
            <CheckCircle sx={{ mr: 1 }} />
            <Typography variant="h6">Accepted Exchanges</Typography>
            {expandedSections.accepted ? <ExpandLess /> : <ExpandMore />}
          </Box>

          {expandedSections.accepted && (
            accepted.length === 0
              ? renderEmptyState('No accepted exchanges')
              : <Stack spacing={2}>{accepted.map(renderRequestCard)}</Stack>
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer', color: 'info.main' }}
            onClick={() => toggleSection('sent')}
          >
            <SwapHoriz sx={{ mr: 1 }} />
            <Typography variant="h6">Sent Requests</Typography>
            {expandedSections.sent ? <ExpandLess /> : <ExpandMore />}
          </Box>

          {expandedSections.sent && (
            sentByMe.length === 0
              ? renderEmptyState('No sent requests')
              : <Stack spacing={2}>{sentByMe.map(req => renderRequestCard(req))}</Stack>
          )}
        </Box>
      )}

    </Box>
  );

};

export default SkillExchangeRequests;