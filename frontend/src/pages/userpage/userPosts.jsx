import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import API from '../../utils/axios.jsx';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
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
    <Container
      maxWidth="xl"
      sx={{ mt: 4, mb: 6 }}
      className="px-4 sm:px-6"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <Typography variant="h6" className="text-gray-600">
              No posts from this user yet.
            </Typography>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="flex justify-center">
              <Box className="w-full max-w-md">
                <PostCard
                  post={post}
                  user={currentUser}
                  setPosts={setPosts}
                  setFilteredPosts={setPosts}
                />
              </Box>
            </div>
          ))
        )}
      </div>
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
