import React, { useState } from 'react';
import { 
  Box, TextField, Button, Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';

const PostSearch = ({ posts, setFilteredPosts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts); 
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = posts.filter(post => {
      switch(searchType) {
        case 'title': return post.title.toLowerCase().includes(term);
        case 'author': return post.author?.name?.toLowerCase().includes(term);
        default: return true;
      }
    });
    setFilteredPosts(results);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Search By</InputLabel>
        <Select
          value={searchType}
          label="Search By"
          onChange={(e) => setSearchType(e.target.value)}
          sx={{ bgcolor: 'background.paper' }}
        >
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="author">Author</MenuItem>
        </Select>
      </FormControl>
      
      <TextField
        fullWidth
        variant="outlined"
        label={`Search by ${searchType}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={`Enter ${searchType}...`}
        sx={{ bgcolor: 'background.paper' }}
      />
      
      <Button
        variant="contained"
        onClick={handleSearch}
        disabled={!searchTerm.trim()}
        sx={{ px: 4 }}
      >
        Search
      </Button>
      
      {searchTerm && (
        <Button
          variant="outlined"
          onClick={() => {
            setSearchTerm('');
            setFilteredPosts(posts);
          }}
        >
          Clear
        </Button>
      )}
    </Box>
  );
};

export default PostSearch;