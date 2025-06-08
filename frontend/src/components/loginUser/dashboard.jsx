import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Tabs, Tab, CircularProgress, Button, Typography,} from '@mui/material';
import { useAuth } from '../../context/authContext.jsx';
import ProfileTab from './profileTab.jsx';
import ConnectionsTab from './connectionTab.jsx';
import PostComponent from '../posts/postComponent.jsx';
const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate , activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setShowCreate(false); 
  };

  if (loading || !user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, mb: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Welcome, {user.name || user.email}
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Profile" />
          {user.role?.toLowerCase() !== 'recruiter' && <Tab label="Connections" />}
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <ProfileTab user={user} />
          </Box>
        )}

        {user.role !=='recruiter' && activeTab === 1 && (
          <Box>
            <ConnectionsTab user={user} />

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => setShowCreate(!showCreate)}
              >
                {showCreate ? 'Cancel' : 'Create Post'}
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              {showCreate ? (
                <PostComponent
                  mode="create"
                  onPostCreated={() => setShowCreate(false)}
                />
              ) : (
                <PostComponent mode="list" />
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
