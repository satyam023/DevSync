import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import API from '../../utils/axios.jsx';
import { CircularProgress, Typography, Container, Box } from '@mui/material';
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Posts by this User
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <Typography variant="body1" color="textSecondary">
              No posts from this user yet.
            </Typography>
          </div>
        ) : (
          <div className={`grid ${posts.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
            {posts.map((post) => (
              <div 
                key={post._id} 
                className={`w-full h-full flex justify-center ${posts.length === 2 ? 'max-w-2xl' : ''}`}
              >
                <PostCard
                  post={post}
                  user={currentUser}
                  setPosts={setPosts}
                  setFilteredPosts={setPosts}
                  sx={{
                    width: posts.length === 2 ? '100%' : '100%',
                    maxWidth: posts.length === 2 ? '600px' : 'none'
                  }}
                />
              </div>
            ))}
          </div>
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