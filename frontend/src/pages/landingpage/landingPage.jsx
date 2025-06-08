import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx'; 
import {
  Button, Container, Box, Typography, Grid, Paper, useTheme,
} from '@mui/material';
import {
  Code, Group, School, Security, EmojiObjects, SupportAgent, Rocket,
} from '@mui/icons-material';

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard'); 
    }
  }, [user, loading, navigate]);

  if (loading || user) return null;
  return (
    <Box sx={{ bgcolor: '#f7f9fc', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 800 }}
              >
                Welcome to{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  DevSync
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, color: 'text.secondary', px: { xs: 2, sm: 6 } }}
              >
                A modern platform for developers to{' '}
                <strong>learn</strong>, <strong>collaborate</strong>, and{' '}
                <strong>build</strong> together
                 <Button
                  component={Link}
                  to="/learn-more"
                  variant="text"
                  size="large"
                >
                  Learn More.
                </Button>
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  size="large"
                  startIcon={<Rocket />}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="outlined"
                  size="large"
                >
                  Create Account
                </Button>
               
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 10, backgroundColor: '#f0f4fa' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 6 }}
          >
            Why Choose DevSync?
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {[
              {
                icon: <Code fontSize="large" />,
                title: 'Code Collaboration',
                description: 'Collaborate with your team in real time',
              },
              {
                icon: <Group fontSize="large" />,
                title: 'Community Support',
                description: 'Join and grow with global developers',
              },
              {
                icon: <School fontSize="large" />,
                title: 'Learning Resources',
                description: 'Explore curated tutorials and hands-on projects',
              },
              {
                icon: <Security fontSize="large" />,
                title: 'Secure Environment',
                description: 'Your code and data stay fully protected',
              },
              {
                icon: <EmojiObjects fontSize="large" />,
                title: 'Innovative Tools',
                description: 'Boost productivity with modern dev tools',
              },
              {
                icon: <SupportAgent fontSize="large" />,
                title: '24/7 Support',
                description: 'Expert help available anytime you need',
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={6} key={index} sx={{ display: 'flex' }}>
                <Paper
                  elevation={3}
                  sx={{ width: '100%', height: '100%', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: 6,
                    },
                    boxSizing: 'border-box',
                  }}
                >
                  <Box
                    sx={{
                      mb: 3,display: 'inline-flex',alignItems: 'center',justifyContent: 'center',width: 70,
                      height: 70,borderRadius: '50%',backgroundColor: 'primary.light',color: 'primary.main',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

        </Container>
      </Box>


      {/* Call to Action */}
      <Box sx={{ py: 10, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Ready to Join Our Developer Community?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Thousands of developers are already building amazing projects on DevWorld.
          </Typography>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            size="large"
            sx={{ px: 6, py: 1.5 }}
          >
            Sign Up Free
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
