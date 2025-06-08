const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }]
}, { timestamps: true });

// Virtual for comment likes count



const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  comments: [commentSchema]
}, { timestamps: true });

// Virtual for post likes count
postSchema.virtual('likesCount').get(function () {
  return this.likes?.length || 0;
});

postSchema.virtual('commentsCount').get(function () {
  return this.comments?.length || 0;
});



// Make sure virtuals are included when converting to JSON or Object
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);
