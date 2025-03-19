import { useState, useEffect } from "react";
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

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  useEffect(() => {
    const fetchFeedPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/posts/feed", {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch feed posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `http://localhost:8080/posts/${postId}/like`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update the post in the state
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            // Check if the post is already liked by the current user
            const isLiked = post.isLikedByCurrentUser || false;
            return {
              ...post,
              likes: isLiked
                ? (post.likes || []).filter(
                    (like) => like.userId !== currentUserId
                  )
                : [...(post.likes || []), { userId: currentUserId }],
              isLikedByCurrentUser: !isLiked,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/posts/${postId}/comment`,
        {
          content: commentText,
        },
        {
          withCredentials: true,
        }
      );

      // Update the post in the state
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...(post.comments || []), response.data],
            };
          }
          return post;
        })
      );

      setCommentText("");
      setActiveCommentPost(null);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await axios.post(
        `http://localhost:8080/users/${userId}/follow`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update the UI to reflect the follow status
      setPosts(
        posts.map((post) => {
          if (post.user.id === userId) {
            return {
              ...post,
              user: {
                ...post.user,
                isFollowed: !post.user.isFollowed,
              },
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!Array.isArray(posts)) {
    console.error("Posts is not an array:", posts);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Error: Unable to load posts.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Feed</h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
            <FaRegImage className="mr-2" size={16} />
            Create Post
          </button>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* User info and post header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Link to={`/profile/${post.user?.id}`}>
                      <img
                        src={
                          post.user?.picture || "https://via.placeholder.com/40"
                        }
                        alt={post.user?.name || "User"}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    </Link>
                    <div>
                      <Link
                        to={`/profile/${post.user?.id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {post.user?.name || "Unknown User"}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()} ·
                        <button
                          onClick={() => handleFollow(post.user?.id)}
                          className={`ml-2 font-medium ${
                            post.user?.isFollowed
                              ? "text-gray-600"
                              : "text-blue-500 hover:text-blue-700"
                          }`}
                        >
                          {post.user?.isFollowed ? "Following" : "Follow"}
                        </button>
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <BsThreeDots size={20} />
                  </button>
                </div>

                {/* Open post */}
                <Link to={`/posts/${post.id}`}>MORE</Link>
                {/* Post content */}
                <div className="px-4 pb-3">
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-700 mb-3">{post.content}</p>

                  {/* Post image (if available) */}
                  {post.image && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <img
                        src={post.image}
                        alt="Post content"
                        className="w-full object-cover"
                        style={{ maxHeight: "400px" }}
                      />
                    </div>
                  )}

                  {/* Post stats */}
                  <div className="flex justify-between text-sm text-gray-500 mt-2 mb-3">
                    <div>
                      {post.likes?.length > 0 && (
                        <span>{post.likes.length} likes</span>
                      )}
                    </div>
                    <div>
                      {post.comments?.length > 0 && (
                        <span>{post.comments.length} comments</span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                        post.isLikedByCurrentUser
                          ? "text-red-500"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {post.isLikedByCurrentUser ? (
                        <FaHeart size={18} />
                      ) : (
                        <FaRegHeart size={18} />
                      )}
                      <span>Like</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveCommentPost(
                          activeCommentPost === post.id ? null : post.id
                        )
                      }
                      className="flex items-center space-x-2 px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100"
                    >
                      <FaRegComment size={18} />
                      <span>Comment</span>
                    </button>

                    <button className="flex items-center space-x-2 px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100">
                      <FaShareAlt size={18} />
                      <span>Share</span>
                    </button>

                    <button className="flex items-center space-x-2 px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100">
                      <FaRegBookmark size={18} />
                      <span>Save</span>
                    </button>
                  </div>
                </div>

                {/* Comments section */}
                {activeCommentPost === post.id && (
                  <div className="px-4 py-3 bg-gray-50">
                    {/* Comment input */}
                    <div className="flex items-center space-x-2 mb-3">
                      <img
                        src="https://via.placeholder.com/32"
                        alt="Your profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a comment..."
                          className="w-full border border-gray-200 rounded-full py-2 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleComment(post.id)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                        >
                          <FaPaperPlane size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Comments list */}
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-3 ml-10">
                        {post.comments.slice(0, 3).map((comment) => (
                          <div
                            key={comment.id}
                            className="flex items-start space-x-2"
                          >
                            <Link to={`/profile/${comment.user?.id}`}>
                              <img
                                src={
                                  comment.user?.picture ||
                                  "https://via.placeholder.com/24"
                                }
                                alt={comment.user?.name || "User"}
                                className="w-6 h-6 rounded-full mt-1"
                              />
                            </Link>
                            <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                              <Link
                                to={`/profile/${comment.user?.id}`}
                                className="font-medium text-sm"
                              >
                                {comment.user?.name || "Unknown User"}
                              </Link>
                              <p className="text-sm text-gray-700">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}

                        {post.comments.length > 3 && (
                          <div className="ml-8 text-sm text-blue-500 hover:text-blue-700 cursor-pointer">
                            View all {post.comments.length} comments
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 ml-10">
                        No comments yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-gray-600">No posts available in your feed.</p>
            <p className="mt-2 text-blue-500">
              Follow users to see their posts here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
