import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaShareAlt,
  FaRegImage,
  FaPaperPlane,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const { user } = useContext(AuthContext); // Get user details from AuthContext

  useEffect(() => {
    const fetchFeedPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/posts/feed", {
          withCredentials: true,
        });
        setPosts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch feed posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column - Feed */}
      <div className="w-2/3 p-6">
        <h1 className="text-2xl font-bold mb-6">Feed</h1>
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden p-4"
              >
                <div className="flex items-center justify-between">
                  <Link
                    to={`/profile/${post.user?.id}`}
                    className="flex items-center space-x-3"
                  >
                    <img
                      src={
                        post.user?.picture || "https://via.placeholder.com/40"
                      }
                      alt={post.user?.name || "User"}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {post.user?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                  <BsThreeDots
                    size={20}
                    className="text-gray-400 cursor-pointer"
                  />
                </div>

                <Link
                  to={`/posts/${post.id}`}
                  className="block mt-3 text-lg font-semibold"
                >
                  {post.title}
                </Link>

                {/* Display Thumbnail Image */}
                {post.thumbnailUrl && (
                  <img
                    src={post.thumbnailUrl}
                    alt="Thumbnail"
                    className="rounded-lg w-full object-cover max-h-64"
                  />
                )}

                <p className="text-gray-700 mb-3">{post.content}</p>

                {/* Display Media Files (if any) */}
                {/* {post.mediaUrls?.map((url, index) => (
                  <div key={index} className="mt-3">
                    {post.fileTypes[index] === "image" ? (
                      <img
                        src={url}
                        alt={`Media ${index + 1}`}
                        className="rounded-lg w-full object-cover max-h-64"
                      />
                    ) : (
                      <video
                        src={url}
                        controls
                        className="rounded-lg w-full object-cover max-h-64"
                      />
                    )}
                  </div>
                ))} */}

                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <p>{post.likes?.length || 0} Likes</p>
                  <p>{post.comments?.length || 0} Comments</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No posts available in your feed.</p>
        )}
      </div>

      {/* Right Column - User Profile */}
      <div className="w-1/3 bg-white p-6 border border-gray-200">
        {user ? ( // Use the `user` object from AuthContext
          <div className="text-center">
            <img
              src={user.picture || "https://via.placeholder.com/80"}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto"
            />
            <h2 className="text-lg font-semibold mt-3">{user.name}</h2>
            <p className="text-gray-500">{user.bio || "No bio available."}</p>
            <div className="mt-3 flex justify-center space-x-6">
              <p className="font-medium">{user.followers} Followers</p>
              <p className="font-medium">{user.following} Following</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
