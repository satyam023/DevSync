import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { Container, Grid, CircularProgress, Alert, Box, Typography } from '@mui/material';
import API from '../../utils/axios';
import PostCard from './postCard';
import PostForm from './postForm';

const PostComponent = ({ mode = 'list', onPostCreated }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();
  const currentUserId = user?._id;

  useEffect(() => {
    if (mode === 'list') {
      fetchPosts();
    }
  }, [mode]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/posts/my-posts');
      setPosts(Array.isArray(res.data.posts) ? res.data.posts : []);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async ({ title, content, imageFile }) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (imageFile) formData.append('image', imageFile);

      const res = await API.post('/posts/create-post', formData);
      setSuccess('Post created successfully!');
      if (onPostCreated) onPostCreated(res.data.post);
      if (mode === 'list') fetchPosts();
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await API.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Delete failed');
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      await API.post(`/posts/${postId}/toggle-like`);
      fetchPosts(); 
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleCommentSubmit = async (postId, text) => {
    try {
      await API.post(`/posts/${postId}/comments`, { text });
      fetchPosts(); 
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  if (mode === 'create') {
    return (
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <PostForm 
          onSubmit={handleCreatePost}
          loading={loading}
          error={error}
          success={success}
        />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        My Posts
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : posts.length === 0 ? (
        <Typography>No posts found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {posts.map(post => (
            <Grid item xs={12} md={6} key={post._id}>
              <PostCard
                post={post}
                currentUserId={currentUserId}
                onDelete={handleDelete}
                onToggleLike={handleToggleLike}
                onCommentSubmit={handleCommentSubmit}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PostComponent;