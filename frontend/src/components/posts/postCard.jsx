import { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Divider, IconButton,Collapse,Box
} from '@mui/material';
import { ChatBubbleOutline, ExpandMore, ExpandLess } from '@mui/icons-material';
import PostActions from './postActions';
import PostComments from './postComment';

const PostCard = ({ post, currentUserId, onDelete, onToggleLike, onCommentSubmit }) => {
  const [showComments, setShowComments] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleExpandContent = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ 
      width: { xs: '100%', sm: '90%', md: '70%', lg: 600 }, 
       mx: { xs: 1, sm: 2, md: 6, lg: 18 },
      mb: 4,
      boxShadow: 3,
      borderRadius: 2,
    }}>
      {post.image && post.image !== "No Photo" && (
        <>
        <CardMedia
          component="img"
          height="400"
          image={post.image}
          alt={post.title}
          sx={{ objectFit: "cover" }}
        />
         <Divider sx={{ borderWidth: 1 }} />
        </>
      )}

      <CardContent >
        {/* Post Title */}
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {post.title}   
        </Typography>

        {/* Post Content with expandable option */}
        <Box sx={{ position: 'relative' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {expanded ? post.content : `${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}`}
          </Typography>
          {post.content.length > 150 && (
            <IconButton 
              size="small" 
              onClick={toggleExpandContent}
              sx={{ 
                position: 'absolute', 
                right: 0, 
                bottom: 0,
                backgroundColor: 'background.paper'
              }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </Box>

        {/* Post Metadata */}
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Posted on {new Date(post.createdAt).toLocaleString()}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <PostActions 
          post={post}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onToggleLike={onToggleLike}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <IconButton 
            size="small" 
            onClick={toggleComments}
            sx={{ color: 'text.secondary' }}
          >
            <ChatBubbleOutline fontSize="small" />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {post.comments?.length || 0} comments
            </Typography>
          </IconButton>
        </Box>

        {/* Divider before comments */}
        {showComments && <Divider sx={{ my: 1 }} />}

        <Collapse in={showComments}>
          <PostComments 
            post={post}
            currentUserId={currentUserId}
            onCommentSubmit={onCommentSubmit}
          />
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default PostCard;