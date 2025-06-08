import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { EmojiPeople, RocketLaunch, Groups,School} from '@mui/icons-material';

const LearnMorePage = () => {
  const features = [
    {
      icon: <EmojiPeople fontSize="large" color="primary" />,
      title: "Expert Mentors",
      description: "Learn from professionals with 5+ years at top tech companies. Get 1:1 guidance tailored to your goals."
    },
    {
      icon: <RocketLaunch fontSize="large" color="primary" />,
      title: "Project-Based Learning",
      description: "Build real applications using modern tech stacks that employers actually want to see."
    },
    {
      icon: <School fontSize="large" color="primary" />,
      title: "Structured Paths",
      description: "Follow our proven curriculum designed by industry experts to maximize your learning efficiency."
    },
    {
      icon: <Groups fontSize="large" color="primary" />,
      title: "Peer Community",
      description: "Collaborate with fellow learners in our active community for code reviews and networking."
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={8}>
        <Typography
          variant="h2"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: 'linear-gradient(to right, #1976d2, #00b4d8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3
          }}
        >
          Launch Your Tech Career
        </Typography>
        <Typography variant="h5" color="text.secondary" maxWidth="md" mx="auto">
          The most effective way to gain in-demand skills and land your dream tech job.
        </Typography>
      </Box>

      {/* Stats Bar */}
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 8, 
        borderRadius: 2,
        background: 'linear-gradient(to right, #f8f9fa, #e9f5ff)'
      }}>
        <Grid container justifyContent="space-around" textAlign="center">
          <Grid item>
            <Typography variant="h4" fontWeight="bold" color="primary">12,000+</Typography>
            <Typography>Graduates</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" fontWeight="bold" color="primary">94%</Typography>
            <Typography>Job Placement Rate</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" fontWeight="bold" color="primary">6-9</Typography>
            <Typography>Months to Career Ready</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Features Section */}
      <Box mb={10} sx={{marginLeft:'180px'}}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6}>
          Our Proven Approach
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box textAlign="center" height="100%">
                <Box mb={2}>{feature.icon}</Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Ready to Get Started?
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/signup"
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: 50,
            fontSize: '1.1rem',
            background: 'linear-gradient(to right, #1976d2, #00b4d8)'
          }}
        >
          Apply Now
        </Button>
        <Typography variant="body2" color="text.secondary" mt={2}>
          No commitment • Get started in minutes
        </Typography>
      </Box>
    </Container>
  );
};

export default LearnMorePage;