import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
  FaShareAlt,
  FaThumbsUp,
  FaRegThumbsUp,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

const PostCard = ({ post, posts, setPosts }) => {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Fetch like count
        const likesResponse = await axios.get(
          `http://localhost:8080/posts/${post.id}/like-count`,
          { withCredentials: true }
        );
        setLikes(likesResponse.data);

        // Fetch user's like status
        if (user) {
          const userLikeResponse = await axios.get(
            `http://localhost:8080/posts/${post.id}/has-liked`,
            { withCredentials: true }
          );
          setHasLiked(userLikeResponse.data);
        }

        // Fetch comment count
        const commentsResponse = await axios.get(
          `http://localhost:8080/posts/${post.id}/comments`,
          { withCredentials: true }
        );
        setCommentCount(commentsResponse.data.length); // Get number of comments
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
  }, [post.id, user]);

  const handleLike = async () => {
    if (!user) return alert("You must be logged in to like posts.");

    try {
      if (hasLiked) {
        await axios.post(
          `http://localhost:8080/posts/${post.id}/like`,
          {},
          { withCredentials: true }
        );
        setLikes((prev) => prev - 1);
      } else {
        await axios.post(
          `http://localhost:8080/posts/${post.id}/like`,
          {},
          { withCredentials: true }
        );
        setLikes((prev) => prev + 1);
      }
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <Link to={`/profile/${post.user?.id}`} className="flex-shrink-0">
            <img
              src={post.user?.picture || "https://via.placeholder.com/40"}
              alt={post.user?.name || "User"}
              className="w-10 h-10 rounded-full mr-3"
            />
          </Link>
          <div className="flex-1">
            <Link
              to={`/profile/${post.user?.id}`}
              className="font-medium text-gray-900 hover:underline"
            >
              {post.user?.name || "Unknown User"}
            </Link>
            <span className="text-gray-500 mx-1">·</span>
            <span className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <BsThreeDots />
          </button>
        </div>

        <Link to={`/posts/${post.id}`} className="block">
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-700 mb-3">
            {post.content.substring(0, 150)}...
          </p>
        </Link>

        {post.mediaUrls?.length > 0 && (
          <Link to={`/posts/${post.id}`} className="block mb-3">
            <img
              src={post.mediaUrls[0]}
              alt="Post media"
              className="w-full h-64 object-cover rounded-lg"
            />
          </Link>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          {/* Like Button - Changed to thumbs up icon & color based on like status */}
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 ${
              hasLiked ? "text-blue-500" : "text-gray-500"
            } hover:text-blue-600`}
          >
            {hasLiked ? <FaThumbsUp size={18} /> : <FaRegThumbsUp size={18} />}
            <span>{likes}</span>
          </button>

          {/* Comment Count */}
          <Link
            to={`/posts/${post.id}`}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
          >
            <FaRegComment size={18} />
            <span>{commentCount}</span>
          </Link>

          {/* Optional: Add bookmark and share buttons if needed */}
          <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
            <FaRegBookmark size={18} />
          </button>

          <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
            <FaShareAlt size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
