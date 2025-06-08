import { useParams, Outlet, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../../utils/axios.jsx';
import { Box,  Typography,  CircularProgress,  Avatar,  Tabs,  Tab, Grid, Card, Divider, Chip, Badge} from '@mui/material';

const UserProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  function capitalizeFirstSentence(str) {
    if (!str) return '';
    str = str.trim().replace(/\s+/g, ' ');
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get(`/users/${id}`);
        setUserProfile(data.user);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!userProfile) return <Typography>User not found</Typography>;

  const normalizedRates = {
    mentor: userProfile.mentorRate || userProfile.rates?.mentor || 0,
    developer: userProfile.developerRate || userProfile.rates?.developer || 0
  };
  const roleKey = userProfile.role?.toLowerCase();

  // Determine active tab based on current route
  const currentTab = location.pathname.includes('/posts') ? '/posts' : '/profile';

  return (
    <Box sx={{ p: 4 }}>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Box  sx={{width: 16,height: 16,borderRadius: '50%',bgcolor: 'primary.main',border: '2px solid white'}}/>
          }
        >
          <Avatar 
            src={userProfile.image} 
            sx={{ 
              width: 80, 
              height: 80,
              border: '3px solid',
              borderColor: 'primary.main'
            }} 
          />
        </Badge>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {userProfile.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            {capitalizeFirstSentence(userProfile.bio) || 'No bio provided'}
          </Typography>
        </Box>
      </Box>

      {/* Tabs with Active Highlighting */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={currentTab}>
          <Tab
            label="Profile"
            component={NavLink}
            to={`/profile/${id}`}
            value="/profile"
            sx={{ 
              textTransform: 'none',
              fontWeight: currentTab === '/profile' ? 'bold' : 'normal',
              color: currentTab === '/profile' ? 'primary.main' : 'inherit'
            }}
          />
          <Tab
            label="Posts"
            component={NavLink}
            to={`/profile/${id}/posts`}
            value="/posts"
            sx={{ 
              textTransform: 'none',
              fontWeight: currentTab === '/posts' ? 'bold' : 'normal',
              color: currentTab === '/posts' ? 'primary.main' : 'inherit'
            }}
          />
        </Tabs>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ mt: 3 }}>
        <Outlet />

        {/* Default Profile Content */}
        {currentTab === '/profile' && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                p: 3, 
                borderRadius: 3, 
                boxShadow: 3,
                height: '70%',
                 minHeight: 100
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>
                    <Box component="span" fontWeight="bold">Gender:</Box> {userProfile.gender || 'Not specified'}
                  </Typography>
                  <Typography>
                    <Box component="span" fontWeight="bold">Role:</Box> {userProfile.role ? capitalizeFirstSentence(userProfile.role) : 'Learner'}
                  </Typography>
                  <Typography>
                    <Box component="span" fontWeight="bold">Joined:</Box> {new Date(userProfile.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ 
                p: 3, 
                borderRadius: 3, 
                boxShadow: 3,
                height: '70%',
                minHeight: 100
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Professional Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Skills:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {userProfile.skills?.length > 0 ? (
                      userProfile.skills.map((skill, i) => (
                        <Chip 
                          key={i} 
                          label={skill} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No skills listed
                      </Typography>
                    )}
                  </Box>
                </Box>
                {normalizedRates[roleKey] > 0 && (
                  <Typography>
                    <Box component="span" fontWeight="bold">Rate:</Box> ₹{normalizedRates[roleKey]} / {roleKey === 'mentor' ? 'month' : 'project'}
                  </Typography>
                )}
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default UserProfilePage;