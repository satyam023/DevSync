import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import API from '../../utils/axios.jsx';
import { Box, CircularProgress, Typography, Container, Grid } from '@mui/material';
import ErrorBoundary from '../../components/dialog/errorBoundry.jsx';
import PostCard from './../postpage/postCard.jsx';
import { useAuth } from '../../context/authContext';

const UserPosts = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/posts/user/${id}`);
        setPosts(data.posts);
      } catch (err) {
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={4}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Typography color="error" align="center" mt={4}>
      {error}
    </Typography>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6, px: { xs: 2, md: 4 } }}>
      <Grid container spacing={4}>
        {posts.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" sx={{ py: 4  ,  marginLeft: '30vw'}}>
              No posts from this user yet.
            </Typography>
          </Grid>
        ) : (
          posts.map(post => (
            <Grid item xs={12} sm={6} md={6} key={post._id}> 
              <Box sx={{ display: 'flex', justifyContent: 'center', minHeight:200 }}>
                <PostCard
                  post={post}
                  user={currentUser}
                  setPosts={setPosts}
                  setFilteredPosts={setPosts} 
                />
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default function UserPostsWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <UserPosts />
    </ErrorBoundary>
  );
}