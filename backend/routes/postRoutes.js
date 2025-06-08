const express = require('express');
const router = express.Router();
const { createPost, getAllPost, getUserPost, getPostById, updatePost, deletePost, likePost,addComment,likeComment , deleteComment , getUserPostById} 
= require('../controllers/postController');
const { upload } = require('../middleware/cloudinary'); 
const authenticate = require('../middleware/authMiddleware.js');

router.post('/create-post', authenticate, upload.single('image'), createPost);
router.get('/get-posts', authenticate, getAllPost);
router.get('/my-posts', authenticate, getUserPost);
router.get('/user/:userId', authenticate, getUserPostById);
router.get('/:postId', authenticate, getPostById);
router.put('/:id', authenticate, upload.single('image'), updatePost);
router.delete('/:postId', authenticate, deletePost);
router.put('/:postId/like', authenticate, likePost);
router.post('/:postId/comments', authenticate, addComment);
router.delete('/:postId/comments/:commentId', authenticate, deleteComment);

module.exports = router;
