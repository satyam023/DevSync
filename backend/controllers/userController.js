const User = require('../models/User.js');
const Payment = require('../models/paymentSchema.js');
const crypto = require('crypto');
const mongoose = require('mongoose');

const getAllUsers = async (req, res) => {
  try {
    let filter = {};

    if (req.user) {
      filter = { _id: { $ne: req.user._id } };
    }
    // Sab users fetch kar rahe hain, password field exclude karke
    const users = await User.find().select('-password');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(userId)
      .select('-password')
      .populate({ path: 'posts', select: 'title createdAt' })
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const paymentDetails = await Payment.findOne({ userId: user._id }).lean();
    return res.status(200).json({ user, paymentDetails });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


const followAndUnfollow = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }

      const currUser = req.user.id;
      const targetUser = req.params.id;

      if (currUser === targetUser) {
        throw new Error("You can't follow yourself");
      }

      const [currUserExist, targetUserExist] = await Promise.all([
        User.findById(currUser).select('following').session(session),
        User.findById(targetUser).select('followers').session(session)
      ]);

      if (!currUserExist || !targetUserExist) {
        throw new Error("User not found");
      }

      const isFollowing = targetUserExist.followers.some(id =>
        id.toString() === currUser.toString()
      );

      if (isFollowing) {
        targetUserExist.followers.pull(currUser);
        currUserExist.following.pull(targetUser);
      } else {
        targetUserExist.followers.push(currUser);
        currUserExist.following.push(targetUser);
      }

      await Promise.all([
        targetUserExist.save({ session }),
        currUserExist.save({ session })
      ]);

      // Get updated data within the same transaction
      const [updatedTarget, updatedCurrent] = await Promise.all([
        User.findById(targetUser)
          .select('followers')
          .populate({
            path: 'followers',
            select: '_id name email image role title',
            options: { lean: true }
          })
          .session(session),
        User.findById(currUser)
          .select('following')
          .populate({
            path: 'following',
            select: '_id name email image role title',
            options: { lean: true }
          })
          .session(session)
      ]);

      res.status(200).json({
        success: true,
        message: isFollowing ? 'Unfollowed user' : 'Followed user',
        targetUser: {
          _id: updatedTarget._id,
          followers: updatedTarget.followers
        },
        currentUser: {
          _id: updatedCurrent._id,
          following: updatedCurrent.following
        }
      });
    });
  } catch (error) {
    console.error('Follow And Unfollow Error:', error);
    const status = error.message === 'Unauthorized' ? 401 :
      error.message === "You can't follow yourself" ? 400 :
        error.message === "User not found" ? 404 : 500;

    res.status(status).json({
      success: false,
      message: error.message || 'Server error'
    });
  } finally {
    session.endSession();
  }
};

const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('followers')
      .populate({
        path: 'followers',
        select: '_id name email image role title', // Select only necessary fields
        options: { lean: true }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      followers: user.followers
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get users a person is following
const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('following')
      .populate({
        path: 'following',
        select: '_id name email image role title', // Select only necessary fields
        options: { lean: true }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      following: user.following
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  followAndUnfollow,
  getFollowers,
  getFollowing
};