import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Avatar,
  Typography,
  Box,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Tooltip
} from '@mui/material';
import FollowButton from '../followComponent/followButton.jsx';
import { useAuth } from '../../context/authContext.jsx';
import { SwapHoriz, WorkOutline } from '@mui/icons-material'; // Added WorkOutline icon
import SendRequestForm from '../hiring/sendRequestForm.jsx';
const UserCard = ({ user, onUserUpdate }) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState(user.followers || []);
  const [following, setFollowing] = useState(user.following || []);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const isRecruiter = currentUser?.role?.toLowerCase() === 'recruiter';
  const isUserRecruiter = user?.role?.toLowerCase() === 'recruiter';

  if (!user || !user._id || currentUser?._id === user._id) {
    return (
      <div className="border rounded p-4 bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (currentUser?._id && user) {
      const followingStatus = user.followers?.some(follower =>
        follower.toString() === currentUser._id.toString()
      );
      setIsFollowing(followingStatus);
      setFollowers(user.followers || []);
      setFollowing(user.following || []);
    }
    setLoading(false);
  }, [currentUser?._id, user]);

  const handleFollowSuccess = (newStatus) => {
    if (!currentUser || !currentUser._id) {
      console.warn("Missing currentUser or currentUser._id in handleFollowSuccess");
      return;
    }

    setIsFollowing(newStatus);
    setFollowers(prev =>
      newStatus
        ? [...prev, currentUser._id]
        : prev.filter(id => id.toString() !== currentUser._id.toString())
    );

    if (onUserUpdate) onUserUpdate();
  };

  const handleViewProfile = () => {
    navigate(`/profile/${user._id}`);
  };

  const handleSkillExchange = () => {
    navigate(`/skill-exchange`, {
      state: {
        recipientId: user._id,
        recipientName: user.name,
        recipientSkills: user.skills || []
      }
    });
  };

  const handleHireClick = () => {
    navigate(`/hire/${user._id}`, {
      state: {
        recipientName: user.name,
        recipientRole: user.role,
        recipientSkills: user.skills,
      }
    });
  };

  const handleMentorClick = () => {
    navigate(`/mentor/${user._id}`, {
      state: {
        mentorName: user.name,
        mentorRole: user.role,
        mentorSkills: user.skills,
      }
    });
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Card sx={{
      width: '100%',
      p: 3,
      borderRadius: 2,
      boxShadow: 3,
      position: 'relative'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar
          src={user.image}
          alt={user.name}
          sx={{ width: 72, height: 72, border: '2px solid #1976d2' }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight="bold">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.bio || 'No bio available'}
          </Typography>
          {user.role && (
            <Chip
              label={user.role}
              size="small"
              sx={{ mt: 1 }}
              color={user.role.toLowerCase() === 'recruiter' ? 'secondary' : 'primary'}
            />
          )}
        </Box>
      </Box>

      {/* Follow Info - Hidden for recruiters */}
      {!isUserRecruiter && (
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          borderRadius: 2,
          px: 2,
          py: 1,
        }}>
          <Typography variant="caption" fontWeight="bold">
            Followers: {followers.length}
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="caption" fontWeight="bold">
            Following: {following.length}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Skills Section */}
      {user.skills?.length > 0 && isUserRecruiter && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Skills:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {user.skills.map((skill, index) => (
              <Chip key={index} label={skill} size="small" />
            ))}
          </Box>
        </Box>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleViewProfile}
          sx={{ textTransform: 'none' }}
        >
          View Profile
        </Button>

        {currentUser?.id !== user._id && (
          <>
            {/* Hide exchange button for recruiters */}
            {!isUserRecruiter && !isRecruiter && (
              <Tooltip title="Initiate skill exchange">
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  startIcon={<SwapHoriz />}
                  onClick={handleSkillExchange}
                  disabled={!user.skills?.length}
                  sx={{ textTransform: 'none' }}
                >
                  Exchange
                </Button>
              </Tooltip>
            )}

            {/* Show hire button for recruiters viewing non-recruiters */}


            {isRecruiter && !isUserRecruiter && (
              <Tooltip title="Hire this candidate">
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  startIcon={<WorkOutline />}
                  onClick={handleHireClick}  // <-- Show form here
                  sx={{ textTransform: 'none' }}
                >
                  Hire
                </Button>
              </Tooltip>
            )}

            {currentUser?.role === 'learner' && user?.role === 'mentor' && (
              <Tooltip title="Request Mentorship">
                <Button
                  variant="contained"
                  size="small"
                  color="info"
                  startIcon={<WorkOutline/>}
                  onClick={handleMentorClick}
                  sx={{ textTransform: 'none' }}
                >
                  Take Mentorship
                </Button>
              </Tooltip>
            )}

            {/* Hide follow button for recruiters */}
            {!isUserRecruiter && (
              <FollowButton
                targetUserId={user._id}
                isFollowing={isFollowing}
                onFollowChange={handleFollowSuccess}
              />
            )}
          </>
        )}
      </Box>

    </Card>
  );
};

export default UserCard;