import React, { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const PostComments = ({ post, currentUserId, onCommentSubmit, onDeleteComment }) => {
  const [commentText, setCommentText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const open = Boolean(anchorEl);

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onCommentSubmit(post._id, commentText);
    setCommentText('');
  };

  const handleMenuClick = (e, commentId) => {
    setAnchorEl(e.currentTarget);
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
    <div className="mt-4">
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Comments ({post.comments?.length || 0})
      </p>

      <div className="max-h-52 overflow-y-auto space-y-4 pr-2">
        {post.comments?.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 pl-2">No comments yet.</p>
        ) : (
          post.comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-3">
              <img
                src={comment.author?.avatar}
                alt={comment.author?.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {comment.author?.name || 'Anonymous'}
                  </span>
                  {comment.author._id === currentUserId && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, comment._id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {comment.text}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Menu for delete */}
              <Menu
                anchorEl={anchorEl}
                open={open && selectedCommentId === comment._id}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleDelete} className="text-red-600">
                  Delete Comment
                </MenuItem>
              </Menu>
            </div>
          ))
        )}
      </div>

      {/* Input box */}
      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          disabled={post.author._id === currentUserId}
          className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={!commentText.trim() || post.author._id === currentUserId}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostComments;
