const express = require('express');
const router = express.Router();
const hiringController = require('../controllers/hiringController');
const authenticate = require('../middleware/authMiddleware.js');

router.post('/create', authenticate, hiringController.createHiringRequest);
router.patch('/accept/:hiringId', authenticate, hiringController.acceptHiring);
router.patch('/reject/:hiringId', authenticate, hiringController.rejectHiring);
router.patch('/complete/:hiringId', authenticate, hiringController.completeHiring);
router.get('/received', authenticate, hiringController.getReceivedHiringRequests);
router.get('/sent', authenticate, hiringController.getSentHiringRequests);
router.get('/check/:candidateId', authenticate, hiringController.checkHiringRequest);



module.exports = router;
