const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  razorpayContactId: { 
    type: String,
    required: false 
  },
  razorpayFundAccountId: { 
    type: String,
    required: false 
  },
  upiId: { 
    type: String,
    required: false 
  },
  bankDetails: {
    accountHolderName: { type: String, required: false },
    accountNumber: { type: String, required: false },
    ifsc: { type: String, required: false },
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
  