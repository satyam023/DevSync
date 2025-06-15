import { useState } from 'react';
import {
  ChatBubbleOutline,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import PostActions from './postActions';
import PostComments from './postComment';

const PostCard = ({ post, currentUserId, onDelete, onToggleLike, onCommentSubmit }) => {
  const [showComments, setShowComments] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleComments = () => setShowComments(!showComments);
  const toggleExpandContent = () => setExpanded(!expanded);

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-0">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md mb-6 overflow-hidden">

        {/* Image Section */}
        {post.image && post.image !== 'No Photo' && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-60 object-cover"
          />
        )}

        {/* Content Section */}
        <div className="p-4">
          {/* Post Title */}
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {post.title}
          </h2>

          {/* Post Content */}
          <div className="relative mb-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {expanded
              ? post.content
              : `${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}`}
            
            {post.content.length > 150 && (
              <button
                onClick={toggleExpandContent}
                className="text-blue-500 text-xs mt-1 inline-flex items-center"
              >
                {expanded ? <>Show Less <ExpandLess fontSize="small" /></> : <>Show More <ExpandMore fontSize="small" /></>}
              </button>
            )}
          </div>

          {/* Meta */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Posted on {new Date(post.createdAt).toLocaleString()}
          </p>

          <hr className="my-2 border-gray-300 dark:border-gray-600" />

          {/* Post Actions */}
          <PostActions
            post={post}
            currentUserId={currentUserId}
            onDelete={onDelete}
            onToggleLike={onToggleLike}
          />

          {/* Comment Toggle */}
          <div className="flex justify-end mt-2">
            <button
              onClick={toggleComments}
              className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition"
            >
              <ChatBubbleOutline fontSize="small" />
              <span className="ml-1">{post.comments?.length || 0} comments</span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <>
              <hr className="my-2 border-gray-300 dark:border-gray-600" />
              <PostComments
                post={post}
                currentUserId={currentUserId}
                onCommentSubmit={onCommentSubmit}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
