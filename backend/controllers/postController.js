const Post = require("../models/Post.js");
const User = require("../models/User.js");

// Create Post
const createPost = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const authorId = req.user.id;
    const imageUrl = req.file ? req.file.path : null;

    if (!authorId) {
      return res.status(404).json({ message: "Author not found!" });
    }
    const newPost = await Post.create({
      title,
      content,
      image: imageUrl,
      author: authorId,
    });
    res.status(201).json({
      message: "Post created successfully",
      post: newPost.toJSON(),
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Posts
const getAllPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ author: { $ne: userId } })
      .populate("author", "name email image")
      .populate("comments.author", "name email image")
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Get All post error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Posts
const getUserPost = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const posts = await Post.find({ author: userId })
      .populate("author", "name email image")
      .populate("comments.author", "name email image")
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    if (posts.length === 0) {
      return res.status(404).json({ message: "There are no posts" });
    }

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Get user post error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Posts by User ID
const getUserPostById = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId })
      .populate("author", "name email image")
      .populate("comments.author", "name email image")
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Get user post by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get Post by ID
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate("author", "name email image")
      .populate("comments.author", "name email image");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post.toJSON()); // include virtuals
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Update Post
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this post" });
    }

    const { title, content, image } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (image) post.image = image;

    const updatedPost = await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost.toJSON(),
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Delete Post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.some((id) => id.equals(userId));
    if (liked) post.likes.pull(userId);
    else post.likes.push(userId);

    await post.save();
    const updatedPost = await Post.findById(postId).lean();

    res.status(200).json({
      post: {
        ...updatedPost,
        likesCount: updatedPost.likes.length,
      },
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Add Comment to Post
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      text: text.trim(),
      author: userId,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    // Fetch updated post with full author data
    const populatedPost = await Post.findById(post._id)
      .populate("comments.author", "_id name email image")
      .populate("author", "_id name email image")
      .lean({ virtuals: true });

    return res.status(200).json({
      message: "Comment added successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const commentIndex = post.comments.findIndex(
      (c) => c._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (post.comments[commentIndex].author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("comments.author", "_id name email image")
      .populate("author", "_id name email image")
      .lean({ virtuals: true });

    return res.status(200).json({
      message: "Comment deleted successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createPost,
  getAllPost,
  getUserPost,
  getUserPostById,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
};
