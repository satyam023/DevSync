const express = require('express');
const router = express.Router();

const { getUserById, followAndUnfollow, getAllUsers, getFollowers,getFollowing } = require('../controllers/userController');

const authenticate = require('../middleware/authMiddleware.js'); 
const validateUpdateProfile = require('../middleware/validateUpdateProfile.js');

router.get('/getuser', authenticate, getAllUsers);   
router.get('/:userId', authenticate, getUserById);
router.post('/follow/:id', authenticate, followAndUnfollow);
router.get('/:userId/followers', authenticate, getFollowers);
router.get('/:userId/following', authenticate, getFollowing);

module.exports = router;
