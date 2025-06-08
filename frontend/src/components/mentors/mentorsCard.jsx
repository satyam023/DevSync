import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, Chip, Divider, Box, CircularProgress, Stack, Button, ButtonGroup, Tabs, Tab, Avatar,
} from '@mui/material';
import API from '../../utils/axios.jsx';
import { ExpandLess, ExpandMore, School } from '@mui/icons-material';
import PaymentButton from '../../components/payment/paymentButton.jsx';

const MentorshipStatusCard = ({ user }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [expandedTabs, setExpandedTabs] = useState({ 0: true, 1: false, 2: false });

    const role = user.role?.toLowerCase();
    const isMentor = role === 'mentor';
    const isLearner = role === 'learner';
        
    const toggleTabExpansion = (index) => {
        setExpandedTabs((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const endpoint = isMentor ? '/mentor-requests/received' : '/mentor-requests/sent';
                const res = await API.get(endpoint);
                setRequests(res.data.requests || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isMentor, isLearner]);


    const updateStatus = async (id, status) => {
        setActionLoading(id);
        const routeMap = {
            accepted: 'accept',
            rejected: 'reject',
            completed: 'complete',
        };

        const route = routeMap[status];

        if (!route) {
            console.error(`Invalid status: ${status}`);
            setActionLoading(null);
            return;
        }

        try {
            await API.patch(`/mentor-requests/${route}/${id}`, { status });
            setRequests((prev) =>
                prev.map((r) => (r._id === id ? { ...r, status } : r))
            );
            console.log(`Status updated to ${status}`);
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setActionLoading(null);
        }
    };
    

    const filterByStatus = (status) => requests.filter((r) => r.status === status);

    const mentorTabs = [
        { label: `Pending (${filterByStatus('pending').length})`, status: 'pending' },
        { label: `Accepted (${filterByStatus('accepted').length})`, status: 'accepted' },
        { label: `Completed (${filterByStatus('completed').length})`, status: 'completed' },
    ];

    const learnerTabs = [
        { label: `Sent (${filterByStatus('pending').length})`, status: 'pending' },
        { label: `Accepted (${filterByStatus('accepted').length})`, status: 'accepted' },
        { label: `Completed (${filterByStatus('completed').length})`, status: 'completed' },
    ];


    const renderMentorList = (list, status) => (
        list.length === 0 ? (
            <Typography>No mentorship requests.</Typography>
        ) : (
            list.map((req) => (
                <Box key={req._id} sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Avatar src={req.learner?.image} />
                        <Typography><strong>From:</strong> {req.learner?.name}</Typography>
                    </Stack>
                    <Typography>Offered Rate: {req.offeredRate || req?.mentor?.rates?.mentor} {`₹/month`}</Typography>
                    <Typography>Email: {req.learner?.email}</Typography>
                    <Typography>Message: {req.message}</Typography>
                    <Chip
                        label={req.status.toUpperCase()}
                        color={req.status === 'pending' ? 'warning' : req.status === 'accepted' ? 'success' : 'primary'}
                    />
                    {req.status === 'accepted' && (
                        
                        <Chip
                            label={req.paid ? 'Payment Received' : 'Payment Pending'}
                            color={req.paid ? 'success' : 'warning'}
                            sx={{ ml: 1 }}
                        />
                    )}
                    <ButtonGroup sx={{ mt: 1 }} size="small">
                        {status === 'pending' && (
                            <>
                                <Button onClick={() => updateStatus(req._id, 'accepted')}   sx={{ml:1}} color="success">Accept</Button>
                                <Button onClick={() => updateStatus(req._id, 'rejected')}   sx={{ml:1}} color="error">Reject</Button>
                            </>
                        )}
                        {status === 'accepted' && (
                            <Button onClick={() => updateStatus(req._id, 'completed')}  sx={{ml:1}}  color="primary">Mark as Completed</Button>
                        )}
                    </ButtonGroup>
                </Box>
            ))
        )
    );

    const renderLearnerList = (list, status) => (
        list.length === 0 ? (
            <Typography>No mentorship requests.</Typography>
        ) : (
            list.map((req) => (
                <Box key={req._id} sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Avatar src={req.mentor?.image} />
                        <Typography><strong>To:</strong> {req.mentor?.name}</Typography>
                    </Stack >
                    <Typography>  Rates: {req?.mentor?.rates?.mentor || "Not specified"} {`₹/month`}</Typography>
                    <Typography>Offered Rate: {req.offeredRate || req?.mentor?.rates?.mentor}{`₹/month`} </Typography>
                    {status === 'accepted' && (
                        <Typography>Email: {req.mentor?.email}</Typography>
                    )}
                    <Typography>Message: {req.message}</Typography>
                    <Chip
                        label={req.status.toUpperCase()}
                        color={req.status === 'pending' ? 'warning' : req.status === 'accepted' ? 'success' : 'primary'}
                    />
                    {status === 'accepted' && (
                        <PaymentButton
                            data={{
                                amount: req.offeredRate || req?.mentor?.rates?.mentor,
                                toUserId: req?.mentor?._id,
                                 mentorRequestId: req._id,
                            }}
                            type="mentor"
                            disabled={req.paid == true}
                            buttonText={req.paid ? "Paid" : "Pay Now"}
                        />

                    )}
                </Box>
            ))
        )
    );

    if (!isMentor && !isLearner) return null;
    if (loading) return <CircularProgress sx={{ m: 2 }} />;

    return (
        <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <School fontSize="large" />
                        {isMentor ? 'Mentorship Requests Received' : 'Mentorship Requests Sent'}
                    </Typography>
                </Box>

                <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} sx={{ mb: 2 }}>
                    {(isMentor ? mentorTabs : learnerTabs).map((tab, i) => (
                        <Tab key={i} label={tab.label} />
                    ))}
                </Tabs>

                <Divider sx={{ mb: 2 }} />

                {(isMentor ? mentorTabs : learnerTabs).map((tab, i) => (
                    tabIndex === i && (
                        <Box key={tab.label}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h6" fontWeight="bold">
                                    {tab.status.toUpperCase()} Requests
                                </Typography>
                                <Button onClick={() => toggleTabExpansion(i)} size="small">
                                    {expandedTabs[i] ? <ExpandLess /> : <ExpandMore />}
                                </Button>
                            </Box>
                            {expandedTabs[i] && (
                                isMentor
                                    ? renderMentorList(filterByStatus(tab.status), tab.status)
                                    : renderLearnerList(filterByStatus(tab.status), tab.status)
                            )}
                        </Box>
                    )
                ))}
            </CardContent>
        </Card>
    );
};

export default MentorshipStatusCard;
