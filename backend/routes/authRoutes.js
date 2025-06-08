const express = require('express');
const { registerUser, loginUser, logoutUser , checkAuth , deleteUserAccount } = require('../controllers/authController.js');
const verifyAuthentication = require('../middleware/authMiddleware.js');
const router = express.Router();
const { upload } = require('../middleware/cloudinary'); 

router.get('/check-auth', verifyAuthentication, checkAuth);
router.post('/signup', upload.single('image'), registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyAuthentication, logoutUser);
router.delete('/delete', verifyAuthentication, deleteUserAccount);

module.exports = router;