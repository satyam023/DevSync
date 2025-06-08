const mongoose = require('mongoose');

const hiringSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  role: {
    type: String,
    enum: ['mentor', 'developer'],
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  message: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  paid: {
    type: Boolean,
    default: false
  },
  transactionId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Transaction',
  default: null
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hiring', hiringSchema);
