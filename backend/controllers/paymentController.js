const crypto = require('crypto');
const Razorpay = require('razorpay');

const Transaction = require('../models/transactionSchema.js');
const Hiring = require('../models/hiringSchema.js');
const MentorRequest = require('../models/mentorRequestSchema.js'); // ✅ Add this line

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order 
const createOrder = async (req, res) => {
  try {
    const { amount, toUserId, purpose, mentorRequestId, hireId } = req.body;
    const fromUserId = req.user.id;
    
    if (!amount || !toUserId) {
      return res.status(400).json({ message: 'Missing required fields: amount or toUserId' });
    }

    const options = {
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (razorpayError) {
      console.error('Razorpay order creation failed:', razorpayError);
      return res.status(500).json({
        message: 'Razorpay order creation failed',
        details: razorpayError.message,
      });
    }

    const transaction = new Transaction({
      fromUser: fromUserId,
      toUser: toUserId,
      amount,
      status: 'pending',
      razorpayOrderId: order.id,
      purpose,
      mentorRequestId: mentorRequestId || null,
      hireId: hireId || null,
    });

    await transaction.save();

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount,
      currency: options.currency,
      transactionId: transaction._id,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ success: false, message: 'Server error', details: error.message });
  }
};

// Verify 
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const transaction = await Transaction.findOne({ razorpayOrderId });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.status === 'success') {
      return res.status(200).json({ success: true, message: 'Payment already verified' });
    }

    transaction.razorpayPaymentId = razorpayPaymentId;
    transaction.status = 'success';
    await transaction.save();


 if (transaction.mentorRequestId) {
  try {
   const updatedRequest = await MentorRequest.findByIdAndUpdate(
  transaction.mentorRequestId,
  { paid: true, transactionId: transaction._id },
  { new: true }
);
  } catch (error) {
    console.error('Failed to update MentorRequest paid status:', error);
  }
}

if (transaction.hireId) {
  try {
    const updatedHiring = await Hiring.findByIdAndUpdate(
      transaction.hireId,
      { paid: true, transactionId: transaction._id },
      { new: true }
    );
  } catch (error) {
    console.error('Failed to update Hiring paid status:', error);
  }
}


    const payoutResponse = {
      id: `fake_payout_${Date.now()}`,
      status: 'processed',
      amount: transaction.amount * 100,
      userId: transaction.toUser,
      mode: 'IMPS',
      purpose: 'payout',
      reference_id: `fake_payout_ref_${Date.now()}`,
      narration: 'Simulated payout in test mode',
    };

    return res.status(200).json({
      success: true,
      message: 'Payment verified and payout simulated',
      payout: payoutResponse,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
