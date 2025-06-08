const mongoose = require('mongoose');
const { Schema } = mongoose;
const transactionSchema = new Schema({
  fromUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
   },
  toUser: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User', required: true 
    },
  amount: {
     type: Number,
      required: true 
    },
  currency: { 
    type: String, 
    default: 'INR'
   },

  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },

  purpose: { type: String }, 
  mentorRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorRequest', default: null },
  hireId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hiring', default: null },
         

}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
