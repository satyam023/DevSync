const SkillExchange = require('../models/SkillExchange');
const User = require('../models/User');

const requestSkillExchange = async (req, res) => {
  try {
    const requesterId = req.user?.id;
    const { recipientId, offeredSkills, requestedSkills } = req.body;
    if (!recipientId || !offeredSkills?.length || !requestedSkills?.length) {
      return res.status(400).json({ 
        message: "Missing required fields",
        details: {
          requires: ["recipientId", "offeredSkills", "requestedSkills"],
          received: req.body
        }
      });
    }
    if (requesterId === recipientId) {
      return res.status(400).json({ 
        message: "Cannot send request to yourself",
        code: "SELF_REQUEST"
      });
    }
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ 
        message: "Recipient not found",
        code: "USER_NOT_FOUND" 
      });
    }
    const existing = await SkillExchange.findOne({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
      $or: [
        { offeredSkills: { $in: offeredSkills.map(s => new RegExp(s, 'i')) } },
        { requestedSkills: { $in: requestedSkills.map(s => new RegExp(s, 'i')) } }
      ]
    });

    if (existing) {
      return res.status(400).json({
        message: "Duplicate pending request exists",
        code: "DUPLICATE_REQUEST",
        existingRequest: existing._id 
      });
    }
    const newRequest = new SkillExchange({
      requester: requesterId,
      recipient: recipientId,
      offeredSkills: offeredSkills.map(s => s.trim()),
      requestedSkills: requestedSkills.map(s => s.trim())
    });

    await newRequest.save();
    
    return res.status(201).json({
      success: true,
      message: "Request sent successfully",
      data: newRequest
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const getSkillExchangeRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await SkillExchange.find({
      $or: [{ requester: userId }, { recipient: userId }]
    })
      .populate('requester', 'name role skills image')
      .populate('recipient', 'name role skills image')
      .sort({ createdAt: -1 });
    res.status(200).json({ data: requests });
  } catch (err) {
    console.error("Error in fetching requests:", err);
    res.status(500).json({ message: "Server error." });
  }
};

const respondToSkillExchange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exchangeId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const request = await SkillExchange.findById(exchangeId);
    if (!request) {
      return res.status(404).json({ message: "Exchange request not found." });
    }

    if (request.recipient.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to respond to this request." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "This request has already been responded to." });
    }

    // Update status to accepted/rejected
    request.status = status;
    await request.save();

    let updatedRequester = null;
    let updatedRecipient = null;

    if (status === "accepted") {
      // Use atomic $addToSet to add skills safely without duplicates or race conditions
      await User.findByIdAndUpdate(request.recipient, {
        $addToSet: { skills: { $each: request.offeredSkills } }
      });

      await User.findByIdAndUpdate(request.requester, {
        $addToSet: { skills: { $each: request.requestedSkills } }
      });

      updatedRecipient = await User.findById(request.recipient).select('name role skills image');
      updatedRequester = await User.findById(request.requester).select('name role skills image');
    }

    res.status(200).json({
      message: `Request ${status} successfully.`,
      data: {
        request,
        updatedRequester,
        updatedRecipient,
      },
    });

  } catch (err) {
    console.error("Error in responding to requests:", err);
    res.status(500).json({ message: "Server error." });
  }
};




module.exports = {
  requestSkillExchange, getSkillExchangeRequests, respondToSkillExchange
}