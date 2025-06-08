import React from 'react';
import { Avatar, Typography, Grid, Chip, Divider, Card, CardContent, Box, Stack, Paper } from '@mui/material';
import DeleteAccountButton from './deleteAccountButton.jsx';
import SkillExchangeRequests from './skillExchangeRequest.jsx';
import HiringStatusCard from '../../components/hiring/hiringStatusCard.jsx';
import MentorshipStatusCard from '../../components/mentors/mentorsCard.jsx'
const ProfileTab = ({ user }) => {
  if (!user) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        User data not available
      </Typography>
    );
  }

  const isRecruiter = user.role?.toLowerCase() === 'recruiter';

  const normalizedRates = {
    mentor: user.mentorRate || user.rates?.mentor || 0,
    developer: user.developerRate || user.rates?.developer || 0
  };
  const roleKey = user.role?.toLowerCase();

  // Normalize skills 
  const skillsArray = Array.isArray(user.skills)
    ? user.skills
    : user.skills?.split(',')?.map(s => s.trim()).filter(Boolean) || [];

  function capitalizeFirstSentence(str) {
    if (!str) return '';
    str = str.trim().replace(/\s+/g, ' ');
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            src={user.image}
            alt={user.name}
            sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" fontStyle={'italic'}>
              {user.name || 'Unnamed User'}
            </Typography>
            <Typography variant="body2" sx={{ color: "#2b2a2a", marginLeft: "5px" }}>
              {user.role ? capitalizeFirstSentence(user.role) : 'No Role'}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5,Weight: 600, marginLeft: "2px" }}
            >
              {capitalizeFirstSentence(user.bio) || ''}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, p: 3, boxShadow: 3, height: '70%', minHeight: 100 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
              <Box component="span" fontWeight="bold" color="text.primary">Email:</Box> {user.email || 'Not provided'}
            </Typography>
            <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
              <Box component="span" fontWeight="bold" color="text.primary">Gender:</Box> {user.gender || 'Other'}
            </Typography>
            <Typography variant="body1" color="text.primary">
              <Box component="span" fontWeight="bold" color="text.primary">Role:</Box> {user.role ? capitalizeFirstSentence(user.role) : 'Learner'}
            </Typography>
          </Card>
        </Grid>

        {!isRecruiter && (
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: '70%', minHeight: 100 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Professional Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {skillsArray.length > 0 ? (
                  skillsArray.map((skill, i) => (
                    <Chip key={i} label={skill} size="medium" color="primary" />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No skills listed
                  </Typography>
                )}
              </Box>
              {normalizedRates[roleKey] > 0 ? (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body1" fontWeight="medium" color="text.primary">
                    Rate:
                    <Box component="span" fontWeight="bold" ml={1}>
                      ₹{normalizedRates[roleKey]}
                    </Box>
                    /{roleKey === 'mentor' ? 'month' : 'project'}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No rate specified
                </Typography>
              )}
            </Card>
          </Grid>
        )}
      </Grid>
      
      {!isRecruiter && (
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Card sx={{ width: '72vw', boxSizing: 'border-box' , borderRadius: 2 }}>
            <SkillExchangeRequests userId={user._id} />
          </Card>
        </Grid>
      )}
        <HiringStatusCard user={user} />
        <MentorshipStatusCard user= {user} />
      <DeleteAccountButton />
    </Box>
  );
};

export default ProfileTab;