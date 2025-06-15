import { useState } from 'react';

const PostForm = ({
  initialValues = { title: '', content: '' },
  onSubmit,
  loading,
  error,
  success
}) => {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, imageFile });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto p-6 sm:p-8 bg-white shadow-xl rounded-xl space-y-6"
    >
      <h2 className="text-2xl font-extrabold text-gray-800">
        {initialValues.title ? '✏️ Edit Post' : '📝 Create New Post'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded text-sm">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter post title..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Write your content here..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="inline-flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-5 4V5a1 1 0 00-1-1h-4a1 1 0 00-1 1v6m0 0H6m6 0h6" />
          </svg>
          <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>

        {imageFile && (
          <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-md border shadow"
            />
            <span className="text-sm text-gray-600 max-w-xs truncate">
              {imageFile.name}
            </span>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : '💾 Save Post'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
