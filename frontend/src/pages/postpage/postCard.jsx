import React, { useState } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Avatar
} from '@mui/material';
import PostInteraction from './postInteraction.jsx';

const PostCard = ({ post, user, setPosts, setFilteredPosts }) => {
  const updatePosts = (updatedPost) => {
    setPosts(prevPosts =>
      prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p)
    );
    setFilteredPosts(prevPosts =>
      prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p)
    );
  };

  return (
    <Card
      sx={{
        width: { xs: '100%', sm: '90%', md: '70%', lg: '530px' },
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
        mx: 'auto'
      }}
    >

      {post.image && (
        <CardMedia
          component="img"
          height="300"
          image={post.image}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ px: 4, py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={post.author?.avatar} alt={post.author?.name} sx={{ width: 40, height: 40, mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {post.author?.name || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          {post.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {post.content}
        </Typography>

        <PostInteraction
          post={post}
          user={user}
          updatePosts={updatePosts}
        />
      </CardContent>
    </Card>
  );
};

export default PostCard;