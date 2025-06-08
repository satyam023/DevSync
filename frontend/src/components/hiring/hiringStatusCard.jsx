import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, Chip, Divider, Box, CircularProgress, 
    Stack, Button, ButtonGroup, Tabs, Tab, Avatar,} from '@mui/material';
import API from '../../utils/axios.jsx';
import { ExpandLess, ExpandMore, SwapHoriz } from '@mui/icons-material';
import PaymentButton from '../../components/payment/paymentButton.jsx'

const HiringStatusCard = ({ user }) => {
    const [hirings, setHirings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    const [expandedTabs, setExpandedTabs] = useState({
        0: true,
        1: false,
        2: false,
    });

    const role = user.role?.toLowerCase();
    const isRecruiter = role === 'recruiter';
    const isDeveloper = role === 'developer';

   
    const toggleTabExpansion = (index) => {
        setExpandedTabs((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    useEffect(() => {
        const fetchHiringData = async () => {
            setLoading(true);
            try {
                let endpoint = '';
                if (isRecruiter) endpoint = '/hiring/sent';
                else if (isDeveloper) endpoint = '/hiring/received';
                else return;

                const res = await API.get(endpoint);
                setHirings(res.data.hirings || []);
            } catch (error) {
                console.error('Error fetching hiring data:', error);
                setHirings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHiringData();
    }, [isRecruiter, isDeveloper ,tabIndex ]);

    const updateStatus = async (id, newStatus) => {
        setActionLoading(id);
        try {
            let endpoint = '';
            let data = {};
            if (newStatus === 'accepted') endpoint = `/hiring/accept/${id}`;
            else if (newStatus === 'rejected') endpoint = `/hiring/reject/${id}`;
            else if (newStatus === 'completed') endpoint = `/hiring/complete/${id}`;
            else {
                endpoint = `/hiring/status/${id}`;
                data = { status: newStatus };
            }
            await API.patch(endpoint, data);
            setHirings((prev) => {
                if (newStatus === 'rejected') {
                    return prev.filter((h) => h._id !== id);
                }
                return prev.map((h) => (h._id === id ? { ...h, status: newStatus } : h));
            });
        } catch (error) {
            console.error(`Failed to update status to ${newStatus}:`, error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    if (!isRecruiter && !isDeveloper) return null;

    if (loading) return <CircularProgress sx={{ m: 2 }} />;

    const filterByStatus = (status) => hirings.filter((h) => h.status === status);

    const devTabs = [
        { label: `Pending (${filterByStatus('pending').length})`, status: 'pending' },
        { label: `Accepted (${filterByStatus('accepted').length})`, status: 'accepted' },
        { label: `Completed (${filterByStatus('completed').length})`, status: 'completed' },
    ];

    const recTabs = [
        { label: `Sent (${hirings.length})`, status: 'sent' },
        { label: `Accepted (${filterByStatus('accepted').length})`, status: 'accepted' },
        { label: `Completed (${filterByStatus('completed').length})`, status: 'completed' },
    ];

    // Function to render list items for developer
    const renderDevHiringList = (list, status) => {
        if (list.length === 0) return <Typography>No requests in this category.</Typography>;

        return list.map((hire) => (
            <Box key={hire._id} sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Avatar src={hire.recruiter?.image} alt={hire.recruiter?.name || 'R'} />
                    <Typography variant="body1" fontWeight="bold">
                        From: {hire.recruiter?.name || 'Unknown Recruiter'}
                    </Typography>
                </Stack>

                <Typography variant="body2">Role: {hire.role}</Typography>
                <Typography variant="body2">Duration: {hire.duration}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    Message: {hire.message}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Chip
                        label={hire.status?.toUpperCase() || 'UNKNOWN'}
                        color={
                            hire.status === 'pending'
                                ? 'warning'
                                : hire.status === 'accepted'
                                    ? 'success'
                                    : hire.status === 'rejected'
                                        ? 'error'
                                        : hire.status === 'completed'
                                            ? 'primary'
                                            : 'info'
                        }
                    />

                    {/* Payemnet status only shown when dev accept req*/}
                    {hire.status === 'accepted' && (
                        <Chip
                            label={hire.paid ? 'Payment Received' : 'Payment Pending'}
                            color={hire.paid ? 'success' : 'warning'}
                            variant="outlined"
                            size="small"
                        />
                    )}
                </Stack>

                {(status === 'pending' || status === 'accepted') && (
                    <ButtonGroup variant="outlined" size="small" sx={{ mt: 1 }} disabled={actionLoading === hire._id}>
                        {status === 'pending' && (
                            <>
                                <Button
                                    sx={{ ml: 1 }}color="success" 
                                    onClick={() => updateStatus(hire._id, 'accepted')}
                                >
                                    Accept
                                </Button>
                                <Button
                                    sx={{ ml: 1 }}  color="error"
                                    onClick={() => updateStatus(hire._id, 'rejected')}
                                >
                                    Reject
                                </Button>
                            </>
                        )}
                        {status === 'accepted' && (
                            <Button
                                sx={{ ml: 1 }} color="primary"
                                onClick={() => updateStatus(hire._id, 'completed')}
                            >
                                Mark as Completed
                            </Button>
                        )}
                    </ButtonGroup>
                )}
            </Box>
        ));
    };


    // Function to render list items for recruiter
    const renderRecHiringList = (status) => {
        const list =
            status === 'sent'
                ? hirings
                : status === 'accepted'
                    ? filterByStatus('accepted')
                    : filterByStatus('completed');

        if (list.length === 0) return <Typography>No requests in this category.</Typography>;

        return list.map((hire) => (

            <Box key={hire._id} sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Avatar src={hire.candidate?.image} alt={hire.candidate?.name || 'C'} />
                    <Typography variant="body1" fontWeight="bold">
                        To: {hire.candidate?.name || 'Unknown Candidate'}
                    </Typography>
                </Stack>
                <Typography variant="body2">Role: {hire.role}</Typography>
                <Typography variant="body2">Rate: {hire.rate}</Typography>
                <Typography variant="body2">Duration: {hire.duration}</Typography>
                {hire.status === 'accepted' ? (
                    <Typography variant="body2">   Email: {hire.candidate.email}</Typography>
                ) : null}
                <Typography variant="body2" sx={{ mb: 1 }}>
                    Message: {hire.message}
                </Typography>

                <Chip
                    label={hire.status?.toUpperCase() || 'UNKNOWN'}
                    color={
                        hire.status === 'pending'
                            ? 'warning'
                            : hire.status === 'accepted'
                                ? 'success'
                                : hire.status === 'rejected'
                                    ? 'error'
                                    : hire.status === 'completed'
                                        ? 'primary'
                                        : 'info'
                    }
                />
 
                {/* Pay button only in accepted tab */}
                {hire.status === 'accepted' && (
                    <PaymentButton
                        data={hire}
                        type="hire"
                        disabled={hire.paid === true}
                        buttonText={hire.paid ? "Paid" : "Pay Now"}
                    />
                )}
            </Box>
        ));
    };

    return (
        <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <SwapHoriz fontSize="large" />
                        {isRecruiter ? 'Sent Hiring Requests' : 'Hiring Requests Received'}
                    </Typography>
                </Box>

                <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
                    {(isRecruiter ? recTabs : devTabs).map((tab, i) => (
                        <Tab key={tab.label} label={tab.label} />
                    ))}
                </Tabs>

                <Divider sx={{ mb: 2 }} />

              {/* Render content by role and tab */}
                {(isRecruiter ? recTabs : devTabs).map((tab, i) => (
                    tabIndex === i && (
                        <Box key={tab.label}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={1}
                                sx={{
                                    color:
                                        tab.status === 'pending'
                                            ? 'warning.main'
                                            : tab.status === 'accepted'
                                                ? 'success.main'
                                                : 'primary.main',
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
                                    {isRecruiter
                                        ? tab.status === 'sent'
                                            ? 'You are viewing sent requests.'
                                            : tab.status === 'accepted'
                                                ? 'Accepted requests, waiting for payment/completion.'
                                                : 'Completed hiring requests.'
                                        : tab.status === 'pending'
                                            ? 'You are viewing pending requests.'
                                            : tab.status === 'accepted'
                                                ? 'Accepted requests, waiting for completion.'
                                                : 'Completed hiring requests.'}
                                </Typography>
                                <Button
                                    onClick={() => toggleTabExpansion(i)}
                                    size="small"
                                    variant="outlined"
                                    color={
                                        tab.status === 'pending'
                                            ? 'warning'
                                            : tab.status === 'accepted'
                                                ? 'success'
                                                : 'primary'
                                    }
                                    sx={{ minWidth: 0, p: 0.5 }}
                                >
                                    {expandedTabs[i] ? <ExpandLess /> : <ExpandMore />}
                                </Button>
                            </Box>

                            {expandedTabs[i] && (
                                isRecruiter
                                    ? renderRecHiringList(tab.status)
                                    : renderDevHiringList(filterByStatus(tab.status), tab.status)
                            )}
                        </Box>
                    )
                ))}
            </CardContent>
        </Card>
    );
};

export default HiringStatusCard;
