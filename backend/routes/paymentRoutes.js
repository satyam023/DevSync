const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController.js');
const authenticate = require('../middleware/authMiddleware.js'); 

router.post('/create-order', authenticate, paymentController.createOrder);
router.post('/verify-payment', authenticate, paymentController.verifyPayment);

module.exports = router;
      