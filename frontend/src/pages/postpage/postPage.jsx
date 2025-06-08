import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, CircularProgress, Alert , Typography} from '@mui/material';
import API from '../../utils/axios.jsx';
import { useAuth } from '../../context/authContext.jsx';
import PostSearch from './postSearch.jsx';
import PostCard from './postCard.jsx';

const AllPostsPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get('/posts/get-posts');
        setPosts(response.data.posts);
        setFilteredPosts(response.data.posts);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6, px: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
        Community Posts
      </Typography>

      <PostSearch 
        posts={posts} 
        setFilteredPosts={setFilteredPosts} 
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {filteredPosts.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <Typography variant="h6" color="text.secondary">
                No posts found matching your search
              </Typography>
            </Box>
          </Grid>
        ) : (
          filteredPosts.map((post) => (
            <Grid item xs={12} key={post._id}>
              <PostCard 
                post={post} 
                user={user} 
                setPosts={setPosts}
                setFilteredPosts={setFilteredPosts}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default AllPostsPage;