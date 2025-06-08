const MentorRequest = require('../models/mentorRequestSchema');
const User = require('../models/User');

// Send a mentor request (learner → mentor)
const sendRequest = async (req, res) => {
  try {
     const { mentorId, message ,offeredRate  } = req.body;
      const learnerId = req.user.id;
    if (!mentorId) {
      return res.status(400).json({ error: 'Mentor ID is required' });
    }

    if (mentorId === learnerId.toString()) {
      return res.status(400).json({ error: 'You cannot send request to yourself' });
    }

    const existing = await MentorRequest.findOne({
      learner: learnerId,
      mentor: mentorId,
      offeredRate,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({ error: 'Pending request already exists to this mentor.' });
    }

    const newRequest = new MentorRequest({
      learner: learnerId,
      mentor: mentorId,
      offeredRate,
      message,
      status: 'pending'
    });

    await newRequest.save();
    await newRequest.populate('mentor', 'name email skills rates');
    await newRequest.populate('learner', 'name email skills rates');

    res.status(201).json({ message: 'Request sent successfully', request: newRequest });
  } catch (error) {
    console.error('Error sending request:', error);
    res.status(500).json({ error: 'Server error while sending request' });
  }
};

// Accept a mentor request
const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await MentorRequest.findById(requestId);

    if (!request || request.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid or already handled request.' });
    }

    if (request.mentor.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to accept this request.' });
    }

    request.status = 'accepted';
    await request.save();

    res.json({ message: 'Mentor request accepted.', request });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// Reject a mentor request
const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await MentorRequest.findById(requestId);

    if (!request || request.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid or already handled request.' });
    }

    if (request.mentor.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to reject this request.' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Mentor request rejected.', request });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// Mark as completed
const completeRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await MentorRequest.findById(requestId);

    if (!request || request.status !== 'accepted') {
      return res.status(400).json({ error: 'Invalid or not accepted request.' });
    }

    if (request.mentor.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to complete this request.' });
    }

    request.status = 'completed';
    await request.save();

    res.json({ message: 'Mentorship session marked as completed.', request });
  } catch (error) {
    console.error('Error completing request:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// Get requests received by mentor
const getReceivedRequests = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const requests = await MentorRequest.find({ mentor: mentorId })
      .populate('learner', 'name email image rates')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Get requests sent by learner
const getSentRequests = async (req, res) => {
  try {
    const learnerId = req.user.id;
    const requests = await MentorRequest.find({ learner: learnerId })
      .populate('mentor', 'name email image rates') 
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};

const checkPendingRequest = async (req, res) => {
  try {
    const learnerId = req.user.id;
    const { mentorId  } = req.params;

    if (!mentorId) {
      return res.status(400).json({ error: 'Mentor ID is required' });
    }
    const existing = await MentorRequest.findOne({
      learner: learnerId,
      mentor: mentorId,
      status: 'pending'
    });

    res.json({ exists: !!existing });
  } catch (error) {
    console.error('Error checking pending request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  completeRequest,
  getReceivedRequests,
  getSentRequests ,
  checkPendingRequest
};
