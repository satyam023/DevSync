import { useState } from 'react';
import {  Box,  Button,  IconButton,  Typography, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

const PostActions = ({ post, currentUserId, onDelete, onToggleLike }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const isLiked = post.likes.some(like => 
    typeof like === 'object' ? like._id === currentUserId : like === currentUserId
  );

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(post._id);
    setOpenDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Like Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          color={isLiked ? "primary" : "default"}
          onClick={() => onToggleLike(post._id)}
          disabled={post.author._id === currentUserId}
        >
          {isLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
        </IconButton>
        <Typography>{post.likes?.length || 0} Likes</Typography>
      </Box>

      {/* Delete Button (only shown to post author) */}
      {post.author._id === currentUserId && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteClick}
            fullWidth
            sx={{ mt: 2, py: 1.5 }}
          >
            Delete Post
          </Button>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCancelDelete}
            aria-labelledby="delete-dialog-title"
          >
            <DialogTitle id="delete-dialog-title">
              Confirm Delete
            </DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this post? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmDelete} 
                color="error"
                variant="contained"
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default PostActions;