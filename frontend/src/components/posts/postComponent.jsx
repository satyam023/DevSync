import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import API from "../../utils/axios";
import PostCard from "./postCard";
import PostForm from "./postForm";

const PostComponent = ({ mode = "list", onPostCreated }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();
  const currentUserId = user?._id;

  useEffect(() => {
    if (mode === "list") {
      fetchPosts();
    }
  }, [mode]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/posts/my-posts");
      setPosts(Array.isArray(res.data.posts) ? res.data.posts : []);
    } catch (err) {
      setError("Failed to load posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async ({ title, content, imageFile }) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      const res = await API.post("/posts/create-post", formData);
      setSuccess("Post created successfully!");
      if (onPostCreated) onPostCreated(res.data.post);
      if (mode === "list") fetchPosts();
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Delete failed");
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      await API.post(`/posts/${postId}/toggle-like`);
      fetchPosts();
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleCommentSubmit = async (postId, text) => {
    try {
      await API.post(`/posts/${postId}/comments`, { text });
      fetchPosts();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await API.delete(`/posts/${postId}/comments/${commentId}`);

      setPosts((prevPosts) => {
        const updatedPosts = prevPosts.map((post) => {
          if (post._id === postId) {
            const updatedComments = post.comments.filter(
              (c) => c._id !== commentId
            );
            return {
              ...post,
              comments: updatedComments,
              commentsCount: updatedComments.length,
            };
          }
          {
            console.log(
              "Updated post after comment delete:",
              updatedComments.length
            );
          }
          return post;
        });
        console.log("Updated posts after comment delete:", updatedPosts);
        return updatedPosts;
      });
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment");
    }
  };

  // Create mode
  if (mode === "create") {
    return (
      <div className="max-w-xl mx-auto mt-8 px-4">
        <PostForm
          onSubmit={handleCreatePost}
          loading={loading}
          error={error}
          success={success}
        />
      </div>
    );
  }

  // List mode
  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        My Posts
      </h2>

      {loading ? (
        <div className="flex justify-center mt-16">
          <div className="h-10 w-10 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              onDelete={handleDelete}
              onToggleLike={handleToggleLike}
              onCommentSubmit={handleCommentSubmit}
              onDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostComponent;
