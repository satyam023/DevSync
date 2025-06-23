import React, { useState } from 'react';
import {  Box,  Button,  List,  ListItem,  ListItemText,  Avatar,  TextField,  IconButton,  Typography, Tooltip} from '@mui/material';
import { Send, Comment, CommentOutlined } from '@mui/icons-material';
import API from '../../utils/axios.jsx';
import CommentMenu from './commentMenu.jsx';

const PostComments = ({ post, user, expanded, setExpanded, updatePosts }) => {
  const [commentText, setCommentText] = useState('');

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

      const updatedPost = {
        ...post,
        comments: post.comments.filter(c => c._id !== commentId),
        commentsCount: (post.commentsCount || 0) - 1
      };

      updatePosts(updatedPost);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Tooltip title={expanded ? "Hide comments" : "Show comments"}>
        <Button
          size="small"
          startIcon={expanded ? <Comment color="primary" /> : <CommentOutlined />}
          onClick={() => setExpanded(!expanded)}
          sx={{ 
            mb: 1,
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'transparent'
            }
          }}
        >
          {post.comments?.length || 0}
        </Button>
      </Tooltip>

      {expanded && (
        <Box sx={{ mt: 2 }}>
          <List dense sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
            {post.comments?.length > 0 ? (
              post.comments.map((comment) => (
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
                  <Avatar src={comment.author?.image} sx={{ width: 32, height: 32, mr: 2, mt: '4px' }} />
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
                aria-label="send comment"
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

export default PostComments;
