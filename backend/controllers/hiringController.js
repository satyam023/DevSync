const Hiring = require('../models/hiringSchema');
const User = require('../models/User');

const createHiringRequest = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { candidateId, role, duration, message } = req.body; 

    if (recruiterId === candidateId) {
      return res.status(400).json({ message: 'You cannot hire yourself.' });
    }

    const candidate = await User.findById(candidateId).lean();
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    const rate = candidate.rates?.[role];
    if (!rate) {
      return res.status(400).json({ message: `Candidate has no rate defined for role "${role}".` });
    }

    const hiring = await Hiring.create({
      recruiter: recruiterId,
      candidate: candidateId,
      role,
      rate,
      duration,
      message,
    });
    res.status(201).json({ message: 'Hiring request sent successfully.', hiring });
  } catch (error) {
    console.error('Error creating hiring request:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


const acceptHiring = async (req, res) => {
  try {
    const { hiringId } = req.params;

    const hiring = await Hiring.findById(hiringId);
    if (!hiring || hiring.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid or already handled hiring request.' });
    }

    if (hiring.candidate.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to accept this request.' });
    }

    hiring.status = 'accepted';
    await hiring.save();

    res.json({ message: 'Hiring request accepted.', hiring });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Reject 
const rejectHiring = async (req, res) => {
  try {
    const { hiringId } = req.params;
   
    const hiring = await Hiring.findById(hiringId);
    if (!hiring || hiring.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid or already handled hiring request.' });
    }

    if (hiring.candidate.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to reject this request.' });
    }

    hiring.status = 'rejected';
    await hiring.save();

    res.json({ message: 'Hiring request rejected.', hiring });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

const completeHiring = async (req, res) => {
  try {
    const { hiringId } = req.params;
    const hiring = await Hiring.findById(hiringId);
    if (!hiring || hiring.status !== 'accepted') {
      return res.status(400).json({ 
        message: 'Invalid or not accepted hiring request.' 
      });
    }
// console.log("Hiring.developer:", hiring.candidate);
    if (!hiring.candidate || hiring.candidate.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to complete this request.' 
      });
    }

    hiring.status = 'completed';
    await hiring.save();

    res.json({ 
      message: 'Hiring marked as completed.', 
      hiring 
    });
  } catch (error) {
    console.error("Error completing hiring:", error);
    res.status(500).json({ 
      message: 'Server error.', 
      error: error.message 
    });
  }
};


// Get all 
const getReceivedHiringRequests = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const hirings = await Hiring.find({ candidate: candidateId })
      .populate('recruiter', 'name email image')
      .sort({ createdAt: -1 });

    res.json({ hirings });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

const getSentHiringRequests = async (req, res) => {
  try {
    const recruiterId = req.user.id; 
    const hirings = await Hiring.find({ recruiter: recruiterId })
      .populate('candidate', 'name email image')
      .sort({ createdAt: -1 });

    res.json({ hirings });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
const checkHiringRequest = async (req, res) => {
  try {
    const recruiterId = req.user.id; 
    const candidateId = req.params.candidateId;

    const existing = await Hiring.findOne({
      recruiter: recruiterId,
      candidate: candidateId,
      status: 'pending' 
    });

    if (existing) {
      // console.log('Pending check response:', { exists: true });
      return res.json({ exists: true });
    }

    console.log('Pending check response:', { exists: false });
    return res.json({ exists: false });

  } catch (error) {
    console.error('Error in checkHiringRequest:', error.message);
    res.status(500).json({ error: 'Server error while checking hiring request' });
  }
};


module.exports = {
  createHiringRequest,
  acceptHiring,
  rejectHiring,
  getReceivedHiringRequests,
  getSentHiringRequests,
  completeHiring ,
  checkHiringRequest
};
 