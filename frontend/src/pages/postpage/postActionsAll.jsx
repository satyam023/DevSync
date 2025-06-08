import React, { useCallback } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ThumbUp, ThumbUpOffAlt } from '@mui/icons-material';
import API from '../../utils/axios.jsx';

const PostActions = React.memo(({ post, user, updatePosts, sx }) => {
  const isLiked = post.likes.some(like =>
    typeof like === 'object' ? like._id === user?._id : like === user?._id
  );

  const handleToggleLike = useCallback(async () => {
    try {
      const res = await API.put(`/posts/${post._id}/like`);
      updatePosts(res.data.post);
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  }, [post._id, updatePosts]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleToggleLike} aria-label="like post">
          {isLiked ? <ThumbUp color="primary" /> : <ThumbUpOffAlt />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.likesCount || post.likes?.length || 0}
        </Typography>
      </Box>
    </Box>
  );
});

export default PostActions;
