const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');

const setTokenInCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 3 * 60 * 60 * 1000, 
  });
};


const logoutUser = (req, res) => {
 res.clearCookie('token', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
});

  res.status(200).json({ message: 'User logged out successfully' });
};


const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      bio = '',
      gender = 'other',
      password,
      role = 'learner',
      skills = [],
      rates = {},
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    let imageUrl = req.file ? req.file.path : gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'identicon'
    });

    const newUserData = {
      name,
      email,
      bio,
      gender,
      password,
      role,
      skills,
      image: imageUrl,
      rates: {}
    };


    if (role === 'mentor' && rates.mentor) {
      newUserData.rates.mentor = rates.mentor;
    }
    if (role === 'developer' && rates.developer) {
      newUserData.rates.developer = rates.developer;
    }

    const newUser = new User(newUserData);

    await newUser.save();


    const token = await newUser.generateToken();

    setTokenInCookie(res, token);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        gender: newUser.gender,
        role: newUser.role,
        skills: newUser.skills,
        image: newUser.image,
        rates: newUser.rates
      }
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User Not Found' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate token
    const token = await user.generateToken();

    // token in cookie
    setTokenInCookie(res, token);

    // Respond
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.log('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });  
  } catch (err) {
    console.error('Check auth error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(userId);

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
     sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during account deletion'
    });
  }
};
module.exports = {
  checkAuth,
  registerUser,
  loginUser,
  logoutUser,
  deleteUserAccount 
};
