const mongoose = require('mongoose');

const skillExchangeSchema = new mongoose.Schema({
  requester: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
     required: true
     },
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
     required: true
     },
  status: {
     type: String, enum: ['pending', 'accepted', 'rejected'], 
     default: 'pending'
     },
  requestedSkills: [String],
  offeredSkills: [String],
  createdAt: { 
    type: Date, 
    default: Date.now 
}
},{ timestamps: true });

module.exports = mongoose.model('SkillExchange', skillExchangeSchema);
