import React, { useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
  FaShareAlt,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { AuthContext } from "../../context/AuthContext";

const PostCard = ({
  post,
  savedPosts,
  setSavedPosts,
  posts,
  setPosts,
  followingPosts,
  setFollowingPosts,
}) => {
  const { user } = useContext(AuthContext);
  const isLiked = post.likes?.includes(user?.id);
  const isSaved = savedPosts.some((savedPost) => savedPost.id === post.id);

  const toggleSavePost = async (postId) => {
    try {
      await axios.post(
        `http://localhost:8080/posts/${postId}/save`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update saved posts state
      const isSaved = savedPosts.some((post) => post.id === postId);
      if (isSaved) {
        setSavedPosts(savedPosts.filter((post) => post.id !== postId));
      } else {
        const postToSave =
          posts.find((post) => post.id === postId) ||
          followingPosts.find((post) => post.id === postId);
        if (postToSave) {
          setSavedPosts([...savedPosts, postToSave]);
        }
      }
    } catch (error) {
      console.error("Failed to save/unsave post:", error);
    }
  };

  const likePost = async (postId) => {
    try {
      await axios.post(
        `http://localhost:8080/posts/${postId}/like`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update posts state
      const updatePosts = (postsList) => {
        return postsList.map((p) => {
          if (p.id === postId) {
            const isLiked = p.likes?.includes(user?.id);
            return {
              ...p,
              likes: isLiked
                ? p.likes.filter((id) => id !== user?.id)
                : [...(p.likes || []), user?.id],
            };
          }
          return p;
        });
      };

      setPosts(updatePosts(posts));
      setFollowingPosts(updatePosts(followingPosts));
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 mb-4">
      <div className="flex items-start">
        {/* Author info */}
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Link
              to={`/profile/${post.user?.id}`}
              className="flex items-center justify-center"
            >
              <img
                src={post.user?.picture || "https://via.placeholder.com/40"}
                alt={post.user?.name || "User"}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span className="text-sm font-medium">
                {post.user?.name || "Unknown User"}
              </span>
            </Link>
            <span className="mx-1 text-gray-500">·</span>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Post content */}
          <Link to={`/posts/${post.id}`} className="block mb-2">
            <h2 className="text-xl font-bold mb-1">{post.title}</h2>
            <p className="text-gray-700">{post.content.substring(0, 150)}...</p>
          </Link>

          {/* Post image */}
          {post.thumbnailUrl && (
            <div className="mb-3">
              <img
                src={post.thumbnailUrl}
                alt="Post thumbnail"
                className="rounded-md w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Post metrics */}
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => likePost(post.id)}
                className="flex items-center space-x-1"
              >
                {isLiked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
                <span>{post.likes?.length || 0}</span>
              </button>
              <button className="flex items-center space-x-1">
                <FaRegComment />
                <span>{post.comments?.length || 0}</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => toggleSavePost(post.id)} className="p-1">
                {isSaved ? (
                  <FaBookmark className="text-yellow-500" />
                ) : (
                  <FaRegBookmark />
                )}
              </button>
              <button className="p-1">
                <FaShareAlt />
              </button>
              <button className="p-1">
                <BsThreeDots />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
