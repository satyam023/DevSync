import React, { useState } from 'react';
import { Button } from '@mui/material';
import API from '../../utils/axios.jsx';
import { useAuth } from '../../context/authContext';

const FollowButton = ({ targetUserId, isFollowing, onFollowChange }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (user?.role?.toLowerCase() === 'recruiter') return null;

  const handleFollowAction = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await API.post(
        `/users/follow/${targetUserId}`,
        {},
        { withCredentials: true }
      );
      onFollowChange(!isFollowing);
      setSuccessMessage(isFollowing ? 'Successfully unfollowed' : 'Successfully followed');
    } catch (error) {
      console.error('Follow action error:', error);
      setError(error.response?.data?.message || 'Failed to update follow status');
      onFollowChange(isFollowing);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outlined' : 'contained'}
      color="primary"
      size="small"
      onClick={handleFollowAction}
      disabled={loading}
      sx={{
        textTransform: 'none',
        minWidth: '100px',
      }}
    >
      {loading ? 'Processing...' : isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
