import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Drawer, IconButton, List, ListItemText, Box, ListItemButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleNavigate = (path) => {
    if (path !== '#') {
      navigate(path);
    }
    setDrawerOpen(false);
  };

  const handleLogout = async () => {
  await logout();
  setDrawerOpen(false);
};



  const isRecruiter = user?.role === 'recruiter';

  const navLinks = user
    ? [
          {text: 'Home', path: '/home'},
        !isRecruiter && { text: 'Mentor', path: '/mentor' },
        !isRecruiter && { text: 'Learner', path: '/learner' },
        { text: 'Developer', path: '/developer' },  
        { text: 'All Posts', path: '/posts' },       
        { text: 'Dashboard', path: '/dashboard' },
        { text: 'Logout', action: handleLogout },
      
      ].filter(Boolean)
    : [ 
        
        { text: 'Login', path: '/login' },
        { text: 'Signup', path: '/signup' },
      ];

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
           DevSync
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.path;
              return link.action ? (
                <Button
                  key={idx}
                  color="inherit"
                  onClick={link.action}
                  sx={{ fontWeight: isActive ? 'bold' : 'normal', textDecoration: isActive ? 'underline' : 'none' }}
                >
                  {link.text}
                </Button>
              ) : (
                <Button
                  key={idx}
                  color="inherit"
                  onClick={() => handleNavigate(link.path)}
                  disabled={link.path === '#'}
                  sx={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? 'black' : 'white' }}
                >
                  {link.text}
                </Button>
              );
            })}
          </Box>

          <IconButton
            edge="start"
            sx={{ display: { xs: 'block', md: 'none' }, color: 'white' }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.path;
              return link.action ? (
                <ListItemButton key={idx} onClick={link.action} selected={isActive}>
                  <ListItemText primary={link.text} />
                </ListItemButton>
              ) : (
                <ListItemButton
                  key={idx}
                  onClick={() => handleNavigate(link.path)}
                  disabled={link.path === '#'}
                  selected={isActive}
                >
                  <ListItemText primary={link.text} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
