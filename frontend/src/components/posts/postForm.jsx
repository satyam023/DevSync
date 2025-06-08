import { useState } from 'react';
import { Box, Button, TextField, Alert,Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const PostForm = ({ 
  initialValues = { title: '', content: '' },  onSubmit,  loading,  error,  success 
}) => {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, imageFile });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        {initialValues.title ? 'Edit Post' : 'Create New Post'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        label="Title"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Content"
        fullWidth
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        margin="normal"
        required
      />

      <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="contained"
          component="label"
          disabled={loading}
          startIcon={<PhotoCamera />}
        >
          Upload Image
          <input type="file" hidden accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </Button>

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
          />
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
        sx={{ mt: 3 }}
      >
        {loading ? "Saving..." : "Save Post"}
      </Button>
    </Box>
  );
};

export default PostForm;