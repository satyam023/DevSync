import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Loading data...
      </Typography>
    </Box>

    );
  }
  return children;
};

export default ProtectedRoute;
