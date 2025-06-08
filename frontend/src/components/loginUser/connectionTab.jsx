import React, { useState, useEffect } from 'react';
import {
  Avatar, Typography, Grid, Card, CardContent, List, ListItem,
  ListItemAvatar, ListItemText, Box, Button, Divider, Chip, CircularProgress
  , Collapse
} from '@mui/material';
import {
  People as FollowersIcon,
  PersonAdd as FollowIcon,
  PersonRemove as UnfollowIcon
} from '@mui/icons-material';
import API from '../../utils/axios';
import { useSnackbar } from 'notistack';
import { deepPurple, green } from '@mui/material/colors';
import { useAuth } from '../../context/authContext';

const ConnectionsTab = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const [state, setState] = useState({
    followers: [],
    following: [],
    loading: true
  });

  const [followersExpanded, setFollowersExpanded] = useState(false);
  const [followingExpanded, setFollowingExpanded] = useState(false);

  const fetchConnections = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      const [followersRes, followingRes] = await Promise.all([
        API.get(`/users/${user._id}/followers`, { withCredentials: true }),
        API.get(`/users/${user._id}/following`, { withCredentials: true })
      ]);

      const followers = followersRes.data.followers || [];
      const following = followingRes.data.following || [];
      const followersWithFollowState = followers.map(f => ({
        ...f,
        isFollowing: following.some(u => u._id === f._id),
      }));

      setState({
        followers: followersWithFollowState,
        following,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching connections:', error);
      enqueueSnackbar('Failed to load connections', { variant: 'error' });
      setState(prev => ({ ...prev, loading: false }));
    }
  };


  const handleFollowAction = async (targetUserId, isCurrentlyFollowing) => {
    try {
      await API.post(`/users/follow/${targetUserId}`, {}, { withCredentials: true });

      enqueueSnackbar(
        isCurrentlyFollowing ? 'Successfully unfollowed' : 'Successfully followed',
        { variant: 'success' }
      );
      setState(prev => {
        const updatedFollowers = prev.followers.map(user => {
          if (user._id === targetUserId) {
            return { ...user, isFollowing: !isCurrentlyFollowing };
          }
          return user;
        });

        let updatedFollowing = [...prev.following];
        if (isCurrentlyFollowing) {
          updatedFollowing = updatedFollowing.filter(u => u._id !== targetUserId);
        } else {
          const followedUser = prev.followers.find(u => u._id === targetUserId);
          if (followedUser) {
            updatedFollowing = [...updatedFollowing, { ...followedUser, isFollowing: true }];
          }
        }

        return {
          ...prev,
          followers: updatedFollowers,
          following: updatedFollowing,
        };
      });

    } catch (error) {
      console.error('Follow action error:', error);
      enqueueSnackbar('Failed to update follow status', { variant: 'error' });
    }
  };


useEffect(() => {
  if (user && user._id) {
    fetchConnections(); 
    let count = 0;
    const maxRefreshCount = 2;
    const intervalId = setInterval(() => {
      count++;
      if (count > maxRefreshCount) {
        clearInterval(intervalId);
      } else {
        fetchConnections();
      }
    }, 3000);
    return () => clearInterval(intervalId); 
  }
}, [user]);


  const renderUserItem = (otherUser, isFollowingList = false) => {
      if (otherUser.role === 'recruiter') return null;
    const isCurrentUser = otherUser._id === user._id;
    const isFollowing = isFollowingList || otherUser.isFollowing;
    return (
      <ListItem
        key={otherUser._id}
        sx={{
          py: 1.5,
          px: 2,
          '&:hover': { backgroundColor: 'action.hover', borderRadius: 2 },
          mb: 1
        }}
        secondaryAction={
          !isCurrentUser && (
            <Button
              variant={isFollowing ? 'outlined' : 'contained'}
              size="small"
              startIcon={isFollowing ? <UnfollowIcon /> : <FollowIcon />}
              onClick={() => handleFollowAction(otherUser._id, isFollowing)}
              sx={{
                textTransform: 'none',
                borderRadius: 20,
                px: 2,
                fontSize: 12
              }}
              color={isFollowing ? 'error' : 'primary'}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )
        }
      >
        <ListItemAvatar>
          <Avatar
            src={otherUser.image}
            sx={{
              bgcolor: deepPurple[500],
              width: 48,
              height: 48
            }}
          >
            {otherUser.name?.charAt(0) || '?'}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {otherUser.name || 'Unknown User'}
              </Typography>
              {(
                otherUser.role === 'mentor' ||
                otherUser.role === 'developer' ||
                otherUser.role === 'learner'
              ) && (
                  <Chip
                    label={otherUser.role.charAt(0).toUpperCase() + otherUser.role.slice(1)} // Dynamic label
                    size="small"
                    sx={{
                      bgcolor: green[100],
                      color: green[800],
                      height: 15,
                      fontSize: '0.50rem'
                    }}
                  />
                )}

            </Box>
          }
          sx={{ ml: 1 }}
        />
      </ListItem>
    );
  };

 if (state.loading) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Loading followers and following...
      </Typography>
    </Box>
  );
}
  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        My Network
      </Typography>

      <Grid container spacing={3}>
        {/* Followers */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, mx: 'auto', width: 400 }}>
            <CardContent>
              <Box
                sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}
                onClick={() => setFollowersExpanded(prev => !prev)}
              >

                <FollowersIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Followers ({state.followers.length}) {followersExpanded ? '▲' : '▼'}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Collapse in={followersExpanded} timeout="auto" unmountOnExit>
                {state.followers.length > 0 ? (
                  <List disablePadding>
                    {state.followers.map(u => renderUserItem(u))}
                  </List>
                ) : (
                  <Box>
                    <FollowersIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      No followers yet
                    </Typography>
                  </Box>
                )}
              </Collapse>
            </CardContent>
          </Card>
        </Grid>

        {/* Following */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, mx: 'auto', width: 400 }}>
            <CardContent>
              <Box
                sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}
                onClick={() => setFollowingExpanded(prev => !prev)}
              >
                <FollowersIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Following ({state.following.length}) {followingExpanded ? '▲' : '▼'}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Collapse in={followingExpanded} timeout="auto" unmountOnExit>
                {state.following.length > 0 ? (
                  <List disablePadding>
                    {state.following.map(u => renderUserItem(u, true))}

                  </List>
                ) : (
                  <Box >
                    <FollowersIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Not following anyone yet
                    </Typography>
                  </Box>
                )}
              </Collapse>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConnectionsTab;
