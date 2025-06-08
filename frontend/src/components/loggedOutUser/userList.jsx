import React from 'react';
import UserCard from '../loggedOutUser/userCard.jsx';
import { Container, Typography, Stack } from '@mui/material';

const UsersList = ({ title, users }) => (
  <Container maxWidth="md" sx={{ py: 6 }}>
    <Typography variant="h5" fontWeight="bold" gutterBottom>
      {title}
    </Typography>

    <Stack spacing={3}>
      {users.map(user => (
        <UserCard key={user._id} user={user} />
      ))}
    </Stack>
  </Container>
);

export default UsersList;
