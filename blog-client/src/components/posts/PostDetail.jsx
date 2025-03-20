import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaArrowLeft,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0); // Like count
  const [hasLiked, setHasLiked] = useState(false); // User's like status
  const { user } = useContext(AuthContext);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Fetch post details
        const postResponse = await axios.get(
          `http://localhost:8080/posts/${postId}`,
          {
            withCredentials: true,
          }
        );
        setPost(postResponse.data);

        // Fetch like count for the post
        const likesResponse = await axios.get(
          `http://localhost:8080/posts/${postId}/like-count`,
          {
            withCredentials: true,
          }
        );
        setLikes(likesResponse.data);

        // Fetch user's like status
        if (user) {
          const userLikeResponse = await axios.get(
            `http://localhost:8080/posts/${postId}/has-liked`,
            {
              withCredentials: true,
            }
          );
          setHasLiked(userLikeResponse.data);
        }

        // Fetch comments for the post
        const commentsResponse = await axios.get(
          `http://localhost:8080/posts/${postId}/comments`,
          {
            withCredentials: true,
          }
        );
        setComments(
          Array.isArray(commentsResponse.data) ? commentsResponse.data : []
        );
      } catch (error) {
        console.error("Failed to fetch post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId, user]);

  const fetchLikesList = async () => {
    if (!post) return;

    setLoadingLikes(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/posts/${post.id}/likes`,
        {
          withCredentials: true,
        }
      );
      setLikesList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch likes list:", error);
    } finally {
      setLoadingLikes(false);
    }
  };

  const handleShowLikes = async () => {
    // Only proceed if there are likes
    if (likes > 0) {
      await fetchLikesList();
      setShowLikesModal(true);
    }
  };

  const handleLike = async () => {
    if (!post || !user) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/posts/${post.id}/like`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update the likes in the state
      setLikes(response.data.likeCount); // Assuming the response contains the updated like count
      setHasLiked(response.data.hasLiked); // Assuming the response contains the user's like status
    } catch (error) {
      console.error("Failed to like post:", error);
      alert("Failed to like post. Please try again.");
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !post) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/posts/${post.id}/comment`,
        {
          content: commentText,
        },
        {
          withCredentials: true,
        }
      );

      // Update the comments in the state
      setComments([...comments, response.data]);
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleFollow = () => {
    // Implement follow functionality here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Post not found or error loading content.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold truncate">{post.title}</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* User info and actions */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to={`/profile/${post.user?.id}`}>
                  <img
                    src={post.user?.picture || "https://via.placeholder.com/48"}
                    alt={post.user?.name || "User"}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                </Link>
                <div>
                  <Link
                    to={`/profile/${post.user?.id}`}
                    className="font-medium text-lg text-gray-900 hover:underline"
                  >
                    {post.user?.name || "Unknown User"}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()} at{" "}
                    {new Date(post.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  post.user?.isFollowed
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {post.user?.isFollowed ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          {/* Post content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
            <div className="prose max-w-none text-gray-800">
              <p className="text-lg leading-relaxed">{post.content}</p>
            </div>

            {/* Display Media Files */}
            {post.mediaUrls?.map((url, index) => (
              <div key={index} className="mt-6 rounded-lg overflow-hidden">
                {post.fileTypes[index] === "image" ? (
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="w-full object-cover"
                  />
                ) : (
                  <video src={url} controls className="w-full object-cover" />
                )}
              </div>
            ))}
          </div>

          {/* Post actions */}
          <div className="mt-8 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                    hasLiked
                      ? "text-red-500"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {hasLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                  <span
                    className={`${
                      likes > 0 ? "cursor-pointer hover:underline" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowLikes();
                    }}
                  >
                    {likes} Likes
                  </span>
                </button>

                <button
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={() =>
                    document.getElementById("comment-input").focus()
                  }
                >
                  <FaRegComment size={20} />
                  <span>{comments.length} Comments</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comments section */}
          <div className="bg-gray-50 p-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>

            {/* Comment input */}
            <div className="flex items-start space-x-3 mb-6">
              <img
                src={user?.picture || "https://via.placeholder.com/40"}
                alt="Your profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 relative">
                <textarea
                  id="comment-input"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full border border-gray-200 rounded-lg py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className={`absolute right-3 bottom-3 p-2 rounded-full ${
                    commentText.trim()
                      ? "text-blue-500 hover:bg-blue-50"
                      : "text-gray-300"
                  }`}
                >
                  <FaPaperPlane size={16} />
                </button>
              </div>
            </div>

            {/* Comments list */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <Link to={`/profile/${comment.user?.id}`}>
                      <img
                        src={
                          comment.user?.picture ||
                          "https://via.placeholder.com/40"
                        }
                        alt={comment.user?.name || "User"}
                        className="w-10 h-10 rounded-full mt-1"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                        <Link
                          to={`/profile/${comment.user?.id}`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          {comment.user?.name || "Unknown User"}
                        </Link>
                        <p className="text-gray-700 mt-1">{comment.content}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 pl-2 text-xs text-gray-500">
                        <span>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        <button className="hover:text-gray-700">Like</button>
                        <button className="hover:text-gray-700">Reply</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>

      {/* Likes Modal */}
      {showLikesModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Likes</h3>
              <button
                onClick={() => setShowLikesModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loadingLikes ? (
                <div className="flex justify-center p-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : likesList.length > 0 ? (
                <ul className="divide-y">
                  {likesList.map((like) => (
                    <li key={like._id} className="p-4 hover:bg-gray-50">
                      <Link
                        to={`/profile/${like.user._id}`}
                        className="flex items-center space-x-3"
                        onClick={() => setShowLikesModal(false)}
                      >
                        <img
                          src={
                            like.user.picture ||
                            "https://via.placeholder.com/40"
                          }
                          alt={like.user.name || "User"}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-medium">
                            {like.user.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(like.createdAt).toLocaleDateString()} at{" "}
                            {new Date(like.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No likes yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
