import React from 'react';
import { useState } from 'react';
import { Box, Button, List, TextField, Typography,Avatar,ListItem,ListItemAvatar,ListItemText,Divider,IconButton,Menu,MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const PostComments = ({ post, currentUserId, onCommentSubmit, onDeleteComment }) => {
  const [commentText, setCommentText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const open = Boolean(anchorEl);

  const handleSubmit = () => {
    onCommentSubmit(post._id, commentText);
    setCommentText('');
  };

  const handleMenuClick = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCommentId(null);
  };

  const handleDelete = () => {
    onDeleteComment(post._id, selectedCommentId);
    handleMenuClose();
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Comments ({post.comments?.length || 0})
      </Typography>

      <List sx={{ maxHeight: 200, overflowY: 'auto' }}>
        {post.comments?.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
            No comments yet.
          </Typography>
        ) : (
          post.comments?.map((comment, index) => (
            <React.Fragment key={comment._id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar 
                    alt={comment.author?.name} 
                    src={comment.author?.avatar} 
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {comment.author?.name || 'Anonymous'}
                      </Typography>
                      {comment.author._id === currentUserId && (
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, comment._id)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        display="block"
                      >
                        {comment.text}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < post.comments.length - 1 && <Divider variant="inset" component="li" />}
              
              {/* Comment actions menu */}
              <Menu
                anchorEl={anchorEl}
                open={open && selectedCommentId === comment._id}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  Delete Comment
                </MenuItem>
              </Menu>
            </React.Fragment>
          ))
        )}
      </List>

      <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          disabled={post.author._id === currentUserId}
        />
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit}
          disabled={!commentText.trim() || post.author._id === currentUserId}
        >
          Post
        </Button>
      </Box>
    </Box>
  );
};

export default PostComments;