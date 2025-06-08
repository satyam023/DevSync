const mongoose = require('mongoose');

const mentorRequestSchema = new mongoose.Schema({
  learner: { 
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     required: true
     },
  mentor: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true
     },
  message: { 
    type: String,
     required: true 
    },
  offeredRate: {
    type: Number,
    required: true
  },
  status: {
     type: String,
      enum: ['pending', 'accepted', 'rejected' , 'completed'],
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

module.exports = mongoose.model('MentorRequest', mentorRequestSchema);
