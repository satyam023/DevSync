const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Posts = require('./Post.js')
require('dotenv').config();

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
   bio: {
    type: String,
    default: ''
  },
   gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['mentor', 'learner', 'recruiter', 'developer'],
    default: 'learner'
  },
  rates: {
    mentor: { type: Number, default: 0 },
    developer: { type: Number, default: 0 }
  },
  skills: {
    type: [String],
    default: []
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  image: {
    type: String // image URL
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]

} ,{ timestamps: true });

// Gravatar URL generate karne ka helper
const getGravatarUrl = (email) => {
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

// Password hash & default image set
userSchema.pre('save', async function(next) {
  const user = this;

  // Only if password is modified
  if (user.isModified('password')) {
    try {
      const saltRounds = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
    } catch (err) {
      return next(err);
    }
  }

  // If image not set, generate from email
  if (!user.image && user.email) {
    user.image = getGravatarUrl(user.email);
  }

  next();
});

// Token generator
userSchema.methods.generateToken = async function() {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(), 
        email: this.email,
        role: this.role,
        skills: this.skills,
      },
      process.env.JWT_SECRET_KEY, 
      {
        expiresIn: "3h"
      }
    );
  } catch (err) {
    console.error(err);
    throw new Error('Error generating token');
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
