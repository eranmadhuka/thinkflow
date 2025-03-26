import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import MediaUpload from "./MediaUpload";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";

const EditPost = () => {
  const { user } = useContext(AuthContext);
  const { postId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingMediaUrls, setExistingMediaUrls] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch post details when component mounts
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/posts/${postId}`,
          { withCredentials: true }
        );

        const post = response.data;

        // Ensure the logged-in user is the post author
        if (post.userId !== user._id) {
          setError("You are not authorized to edit this post.");
          return;
        }

        setTitle(post.title);
        setContent(post.content);
        setExistingMediaUrls(post.mediaUrls || []);
      } catch (error) {
        console.error("Failed to fetch post details:", error);
        setError("Failed to load post details. Please try again.");
      }
    };

    fetchPostDetails();
  }, [postId, user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!title || !content) {
      setError("Please fill in all required fields.");
      return;
    }

    // Count image and video files
    const imageFiles = mediaFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const videoFiles = mediaFiles.filter((file) =>
      file.type.startsWith("video/")
    );

    // Validation
    if (
      imageFiles.length +
        existingMediaUrls.filter((url) => url.includes("image")).length >
      3
    ) {
      setError("You can upload up to 3 images.");
      return;
    }

    if (videoFiles.length > 1) {
      setError("You can upload only 1 video.");
      return;
    }

    // Check video size (rough estimate for 30 seconds)
    for (const file of videoFiles) {
      if (file.size > 30 * 1024 * 1024) {
        setError("Video must be less than 30 seconds (max 30MB).");
        return;
      }
    }

    setLoading(true);

    try {
      // Upload new media files to Firebase Storage
      const newMediaUrls = [];
      const newFileTypes = [];

      for (const file of mediaFiles) {
        const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        newMediaUrls.push(url);
        newFileTypes.push(file.type.startsWith("image/") ? "image" : "video");
      }

      // Combine existing and new media URLs
      const mediaUrls = [...existingMediaUrls, ...newMediaUrls];
      const fileTypes = [
        ...existingMediaUrls.map(() => "image"),
        ...newFileTypes,
      ];

      // Determine thumbnail (first image)
      const thumbnailUrl =
        mediaUrls.find((url, index) => fileTypes[index] === "image") || "";

      // Send a PUT request to update the blog post
      const response = await axios.put(
        `http://localhost:8080/posts/${postId}`,
        {
          title,
          content,
          mediaUrls,
          fileTypes,
          thumbnailUrl,
          userId: user.id,
        },
        {
          withCredentials: true,
        }
      );

      setSuccessMessage("Blog post updated successfully!");

      // Redirect to post detail page after a short delay
      setTimeout(() => {
        navigate(`/posts/${postId}`);
      }, 1500);
    } catch (error) {
      console.error("Failed to update blog post:", error);
      setError("Failed to update blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle removing existing media
  const handleRemoveExistingMedia = (urlToRemove) => {
    setExistingMediaUrls(
      existingMediaUrls.filter((url) => url !== urlToRemove)
    );
  };

  // Render existing media previews
  const renderExistingMediaPreviews = () => {
    return existingMediaUrls.map((url, index) => (
      <div key={index} className="relative">
        {url.includes("image") ? (
          <img
            src={url}
            alt={`Existing media ${index + 1}`}
            className="w-24 h-24 object-cover rounded-md"
          />
        ) : (
          <video src={url} className="w-24 h-24 object-cover rounded-md" />
        )}
        <button
          type="button"
          onClick={() => handleRemoveExistingMedia(url)}
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
        >
          X
        </button>
      </div>
    ));
  };

  // If there's an error loading the post, show error message
  if (error && !title) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Blog Post</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Existing Media
          </label>
          <div className="flex space-x-2 mb-4">
            {renderExistingMediaPreviews()}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add More Media
          </label>
          <MediaUpload onFilesSelected={setMediaFiles} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-emerald-300 font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating...
            </span>
          ) : (
            "Update Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditPost;
