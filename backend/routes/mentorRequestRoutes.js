const express = require('express');
const router = express.Router();
const mentorRequestController = require('../controllers/requestController.js');
const authenticate = require('../middleware/authMiddleware.js'); 

router.post('/send', authenticate, mentorRequestController.sendRequest);
router.patch('/accept/:requestId', authenticate, mentorRequestController.acceptRequest);
router.patch('/reject/:requestId', authenticate, mentorRequestController.rejectRequest);
router.patch('/complete/:requestId', authenticate, mentorRequestController.completeRequest);
router.get('/received', authenticate, mentorRequestController.getReceivedRequests);
router.get('/sent', authenticate, mentorRequestController.getSentRequests);
router.get('/check/:mentorId', authenticate, mentorRequestController.checkPendingRequest);

module.exports = router;
