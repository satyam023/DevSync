import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const CommentItem = ({ comment, currentUserId }) => {
  return (
    <>
      <ListItem alignItems="flex-start">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            color={isLiked ? "primary" : "default"}
            disabled={comment.author._id === currentUserId}
          >
            <ThumbUpIcon fontSize="small" />
          </IconButton>
          <ListItemText
            primary={comment.author?.username || "Anonymous"}
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {comment.text}
                </Typography>
                <br />
              </>
            }
          />
        </Box>
      </ListItem>
      <Divider component="li" />
    </>
  );
};

export default CommentItem;
