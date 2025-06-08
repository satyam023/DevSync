import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Box} from '@mui/material';

const DeleteAccountButton = () => {
  const { deleteAccount } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      setError('');
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteAccount();
    } catch (err) {
      setError(err.message || 'Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4  , marginLeft: '55vw'}}>
      <Button
        variant="contained"
        color="error"
        onClick={handleOpen}
        startIcon={<DeleteIcon />}
        sx={{ px: 3 }}
      >
        Delete Account
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-account-dialog"
      >
        <DialogTitle id="delete-account-dialog">
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you absolutely sure you want to delete your account? This action:
          </DialogContentText>
          <ul>
            <li><DialogContentText>Cannot be undone</DialogContentText></li>
            <li><DialogContentText>Will permanently remove all your data</DialogContentText></li>
            <li><DialogContentText>Will log you out immediately</DialogContentText></li>
          </ul>
          {error && (
            <DialogContentText color="error" sx={{ mt: 1 }}>
              {error}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteAccountButton;