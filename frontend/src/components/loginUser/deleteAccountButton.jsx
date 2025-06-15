import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';

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
    <div className="mt-10 flex justify-center md:justify-end px-4">
      <Button
        variant="contained"
        color="error"
        onClick={handleOpen}
        startIcon={<DeleteIcon />}
        className="px-6"
      >
        Delete Account
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you absolutely sure you want to delete your account? This action:
          </DialogContentText>
          <ul className="pl-5 mt-2 list-disc text-sm text-gray-700">
            <li>Cannot be undone</li>
            <li>Will permanently remove all your data</li>
            <li>Will log you out immediately</li>
          </ul>
          {error && (
            <p className="text-red-500 text-sm mt-3">{error}</p>
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
    </div>
  );
};

export default DeleteAccountButton;
