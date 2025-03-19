import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Import the AuthContext

const AddBlogPost = () => {
  const { user } = useAuth(); // Get the authenticated user from the context
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Send a POST request to create a new blog post
      const response = await axios.post(
        "http://localhost:8080/posts",
        {
          title,
          content,
        },
        {
          withCredentials: true, // Include cookies in the request
        }
      );

      // Clear the form after successful submission
      setTitle("");
      setContent("");
      alert("Blog post created successfully!");
    } catch (error) {
      console.error("Failed to create blog post:", error);
      setError("Failed to create blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create a New Blog Post</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-emerald-300"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default AddBlogPost;
