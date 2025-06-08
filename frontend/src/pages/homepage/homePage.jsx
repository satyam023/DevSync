import React from 'react';
import { Box, Typography, Button, Container, useTheme, useMediaQuery, Grid, Card, CardContent } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: isMobile ? 6 : 10,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Welcome to <Box component="span" sx={{ color: theme.palette.secondary.light }}>devSync</Box> 
          </Typography>
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            sx={{ opacity: 0.9, maxWidth: 700, mx: 'auto', mb: 4 }}
          >
            Access your dashboard, track projects, and connect with the dev community.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            component={Link}
            to="/dashboard"
            sx={{ px: 5,py: 1.5, fontSize: '1.1rem',borderRadius: 50,
              boxShadow: theme => `0 4px 14px ${theme.palette.primary.light}`
            }}
          >
            Go to Dashboard
          </Button>
        </Container>
      </Box>

      {/* About DevSync Section */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          What is DevSync?
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mb: 5, color: 'text.secondary' }}>
          DevSync is your all-in-one platform to bridge the gap between learners, developers, and recruiters.
          Whether you’re looking for mentorship, want to collaborate on real-world projects, or are scouting talent,
          DevSync makes it easy and efficient.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  🧑‍🏫 Learner & Mentor Hub
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Learners can find mentors to guide their journey. Mentors can accept requests, track mentee progress,
                  and earn by sharing knowledge.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  💼 Recruitment Made Easy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Developers showcase their portfolios. Recruiters connect directly, view project contributions,
                  and send hiring offers seamlessly.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  🤝 Skill Exchange & Collaboration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Users can post their projects and find collaborators with complementary skills —
                  fostering real, practical development experience.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  🔍 Transparent & Trustworthy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  With built-in payment features, verified profiles, and a clear request system,
                  DevSync ensures every connection is valuable and secure.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;
