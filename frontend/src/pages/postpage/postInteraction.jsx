import React, { useState, useCallback } from 'react';
import { Box, IconButton, Typography, List, ListItem, ListItemText, Avatar, TextField,Tooltip} from '@mui/material';
import { ThumbUp, ThumbUpOffAlt, Comment, Send, CommentOutlined } from '@mui/icons-material';
import API from '../../utils/axios.jsx';
import CommentMenu from './commentMenu.jsx';

const PostInteraction = ({ post, user, updatePosts }) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Like functionality
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

  // Comment functionality
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const tempComment = {
        _id: `temp-${Date.now()}`,
        text: commentText,
        author: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar
        },
        createdAt: new Date().toISOString()
      };

      updatePosts({
        ...post,
        comments: [tempComment, ...post.comments],
        commentsCount: (post.commentsCount || 0) + 1
      });
      setCommentText('');

      const response = await API.post(`/posts/${post._id}/comments`, {
        text: commentText
      });
      updatePosts(response.data.post);
    } catch (err) {
      console.error('Failed to add comment:', err);
      updatePosts({
        ...post,
        comments: post.comments.filter(c => c._id !== tempComment._id),
        commentsCount: post.commentsCount - 1
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/posts/${post._id}/comments/${commentId}`);
      updatePosts({
        ...post,
        comments: post.comments.filter(c => c._id !== commentId),
        commentsCount: (post.commentsCount || 0) - 1
      });
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Like and Comment Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Like Button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleToggleLike}>
            {isLiked ? <ThumbUp color="primary" /> : <ThumbUpOffAlt />}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.likesCount || post.likes?.length || 0}
          </Typography>
        </Box>

        {/* Comment Toggle Button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={expandedComments ? "Hide comments" : "Show comments"}>
            <IconButton onClick={() => setExpandedComments(!expandedComments)}>
              {expandedComments ? <Comment color="primary" /> : <CommentOutlined />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" color="text.secondary">
            {post.commentsCount || post.comments?.length || 0}
          </Typography>
        </Box>
      </Box>

      {/* Comments Section */}
      {expandedComments && (
        <Box sx={{ mt: 2 }}>
          <List dense sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
            {post.comments?.length > 0 ? (
              post.comments.map(comment => (
                <ListItem 
                  key={comment._id}
                  sx={{ alignItems: 'flex-start', py: 1 }}
                  secondaryAction={
                    comment.author?._id === user?._id && (
                      <CommentMenu 
                        comment={comment}
                        onDelete={() => handleDeleteComment(comment._id)}
                      />
                    )
                  }
                >
                  <Avatar src={comment.author?.avatar} sx={{ width: 32, height: 32, mr: 2, mt: '4px' }} />
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="bold">
                        {comment.author?.name || 'Unknown'}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span" display="block">
                          {comment.text}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comments yet
              </Typography>
            )}
          </List>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                sx={{ mr: 1 }}
              />
              <IconButton 
                color="primary" 
                onClick={handleAddComment}
                disabled={!commentText.trim()}
              >
                <Send />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PostInteraction;